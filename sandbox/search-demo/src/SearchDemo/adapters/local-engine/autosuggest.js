import sortedIndexBy from 'lodash/sortedIndexBy';
import difference from 'lodash/difference';
import intersection from 'lodash/intersection';

function wordsSortedByWeight(wordEntries) {
	wordEntries.sort((a, b) => a.wordInfo.weight < b.wordInfo.weight);
	return wordEntries.map((x) => x.word);
}

function normalizedItem(item) {
	if (typeof item == 'string') return {text: item, weight: 1};

	const weight = item.weight || 1;

	if (item.text !== undefined) return {text: item.text, weight};
	else return {data: item.data, weight};
}

function wordsFromString(s) {
	return s.toLowerCase().split(' ');
}

export function getItemWords(item) {
	let words = [];
	if (typeof item == 'string') words = wordsFromString(item);
	else if (item.text !== undefined) words = wordsFromString(item.text);
	else
		for (let prop in item.data) {
			words = words.concat(wordsFromString(item.data[prop]));
		}
	return words;
}

export class Autosuggest {
	constructor(data) {
		const wordIndex = new Map();
		for (let item of data) {
			item = normalizedItem(item);
			for (var word of getItemWords(item)) {
				if (!wordIndex.has(word)) {
					wordIndex.set(word, {items: [], weight: 0});
				}
				let wordInfo = wordIndex.get(word);
				wordInfo.items.push(item);
				wordInfo.weight += item.weight;
			}
		}
		this.wordIndex = [];
		for (var e of wordIndex.entries()) {
			this.wordIndex.push({word: e[0], wordInfo: e[1]});
		}
		this.wordIndex.sort((a, b) => a.word.localeCompare(b.word));
	}

	words() {
		return wordsSortedByWeight([...this.wordIndex]);
	}

	itemsWith(word) {
		var i = sortedIndexBy(this.wordIndex, {word: word}, 'word');
		if (i < this.wordIndex.length && this.wordIndex[i].word === word) {
			var items = this.wordIndex[i].wordInfo.items;
			return [...items];
		} else {
			return [];
		}
	}

	itemsWithAllOf(words) {
		var result = null;
		for (var w of words) {
			w = w.toLowerCase();
			var r = this.itemsWith(w);
			if (result == null) {
				result = r;
			} else {
				result = intersection(result, r);
				if (result.length === 0) return result;
			}
		}
		return result != null ? result : [];
	}

	possibleCompletions(prefix) {
		prefix = prefix.toLowerCase();
		var matchingWordEntries = [];
		var i = sortedIndexBy(this.wordIndex, {word: prefix}, 'word');
		for (; i < this.wordIndex.length; ++i) {
			var wordEntry = this.wordIndex[i];
			if (!wordEntry.word.startsWith(prefix)) break;
			matchingWordEntries.push(wordEntry);
		}
		return wordsSortedByWeight(matchingWordEntries);
	}

	itemsWithPartialWord(prefix, max_count) {
		prefix = prefix.toLowerCase();
		var result = new Set();
		var i = sortedIndexBy(this.wordIndex, {word: prefix}, 'word');
		for (; i < this.wordIndex.length; ++i) {
			var entry = this.wordIndex[i];
			if (!entry.word.startsWith(prefix)) break;
			if (entry.wordInfo.items.length > max_count) return null;
			for (var item of entry.wordInfo.items) result.add(item);
			if (result.size > max_count) return null;
		}
		return [...result].sort((a, b) => a.weight < b.weight);
	}
}

function get_words(text) {
	var words = text.split(' ');
	var complete_words = words.slice(0, -1);
	var partial_word = words[words.length - 1];
	return {complete_words: complete_words, partial_word: partial_word};
}

export class IncrementalAutosuggest {
	constructor(items, max_suggestions) {
		this.items = items;
		this.max_suggestions = max_suggestions;
		this.a = new Autosuggest(this.items);
		this.a0 = this.a;
		this.complete_words = [];
	}

	getSuggestions(value) {
		var v = value.trim();
		if (v === '') {
			return this.wordSuggesions(this.a.words(), []);
		}
		const w = get_words(value);
		const removed_words = difference(this.complete_words, w.complete_words);
		if (removed_words.length > 0) {
			this.a = this.a0;
			this.complete_words = [];
		}
		const new_words = difference(w.complete_words, this.complete_words);
		if (new_words.length > 0) {
			const items = this.a.itemsWithAllOf(w.complete_words);
			this.a = new Autosuggest(items);
		}
		this.complete_words = w.complete_words;

		const items = this.a.itemsWithPartialWord(w.partial_word, this.max_suggestions);
		if (items != null) {
			let result = [...items];
			result.suggestionType = 'item';
			return result;
		}

		const candidateWords = this.a.possibleCompletions(w.partial_word);
		return this.wordSuggesions(candidateWords, w.complete_words);
	}

	wordSuggesions(words, complete_words) {
		words = difference(words, complete_words);
		words = words.filter((w) => w.length > 1);
		words = words.slice(0, this.max_suggestions);
		words.suggestionType = 'word';
		return words;
	}
}
