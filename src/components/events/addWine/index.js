import {connect} from 'react-redux';
import React, {Component} from 'react';
import SearchBar from 'components/shared/ui/SearchBar';

import ProducerList from './ProducerList';
import WineInfo from './WineInfo';
import Footer from './Footer';

import './AddWine.scss';
import DialogBox from 'components/shared/ui/DialogBox';
import {filterWines} from 'components/shared/ui/WineFilter/functions';

const wines = [
	{producer: "Mikkel's Wine", region: 'Toscana de Fredericia', country: 'Italy'},
	{producer: "Another Mikkel's Wine", region: 'Toscana de Fredericia', country: 'Spain'},
	{producer: "Mikkel's Wine", region: 'Toscana de Fredericia', country: 'Japan'},
	{producer: "Mikkel's Wine", region: 'Toscana de Fredericia', country: 'Italy'},
	{producer: "Another Mikkel's Wine", region: 'Toscana de Fredericia', country: 'Spain'},
	{producer: "Mikkel's Wine", region: 'Toscana de Fredericia', country: 'Japan'},
];

class AddWine extends Component {
	state = {
		step1: true,
		selectedWine: {},
		wineList: wines,
		search: '',
	};

	componentDidMount() {
		const {wine, type} = this.props;

		this.setState({selectedWine: wine});

		if (type === 'edit') {
			this.setState({step1: false});
		}
	}

	onFilter = (search) => {
		const list = filterWines(wines, search);

		this.setState({wineList: list});
	};

	onItemClick = (item) => {
		this.setState({step1: false});
		this.setState({
			selectedWine: item,
		});
	};

	onBackClick = () => {
		this.setState({step1: true});
		this.setState({wineList: wines});
		this.setState({search: ''});
	};

	onUpdateFields = (value, id) => {
		const {selectedWine} = this.state;

		this.setState({
			selectedWine: {
				...selectedWine,
				[id]: value,
			},
		});
	};

	onAddWine = () => {
		this.props.onClose();
	};

	render() {
		const {type} = this.props;
		const {step1, selectedWine = {}, wineList} = this.state;

		const footer = (
			<Footer
				disabled={selectedWine && !selectedWine.name}
				type={type}
				step={step1 ? 'step1' : 'step2'}
				onClose={this.props.onClose}
				onBackClick={this.onBackClick}
				onAddWine={this.onAddWine}
			/>
		);

		return (
			<DialogBox customFooter={footer} width={step1 ? 8 : 6} noCallback={this.props.onClose}>
				{type !== 'edit' && <div className="AddWine__Step">Step {step1 ? '1' : '2'} of 2</div>}
				<div className="AddWine__Title">{step1 ? 'Find Producer' : 'Enter wine details'}</div>
				{step1 && (
					<div className="AddWine__Search">
						<SearchBar placeholder="wine_event_search_placeholder" onHandleChange={this.onFilter} />
					</div>
				)}
				{step1 ? (
					<ProducerList onHandleChange={this.onItemClick} wineList={wineList} />
				) : (
					<WineInfo
						onBackClick={this.onBackClick}
						wine={selectedWine}
						type={type}
						onUpdateFields={this.onUpdateFields}
					/>
				)}
			</DialogBox>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		wines: state.wines,
		events: state.events,
	};
}

export default connect(mapStateToProps)(AddWine);
