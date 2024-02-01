import fetch from 'node-fetch';

const conf = {
	gqlUrl: 'https://api.bottlebooks.me/graphql', // https://www.graphqlbin.com/v2/B8WGUD
	err: {
		load: {
			status: 'error',
			message: 'Data could not be loaded',
		},
		data: {
			status: 'error',
			message: 'Product or event not found',
		},
	},
};

const gqlProductInfo = ` 
	productId
	shortName
	... on Wine {
		vintage
		country
		region
		subregion
		wineType(format: RAW)
		wineColor(format: RAW)
		grapeVarieties{
			varietyName
			percentage
		}
		bottleImage{
			name
			fixed(height:1200){
			src
			}
			sourceUrl
		}
		labelImage{
			name
			fixed( height:1200){
			src
			
			}
			sourceUrl
		}
		backLabelImage{
			name
			fixed( height:1200){
			src
			}
			sourceUrl
		}
	producer{
		name(removePrefix: true, removeSuffix: true),
		producerId
	}
`;

export default async function (productId: string, eventId: string, exhibitorId = '') {
	// return stub;

	let selection = [];

	if (exhibitorId) {
		selection.push(loadProduct(eventId, productId, exhibitorId));
	}

	if (!selection.length) {
		console.warn('doing the long one');
		let products = (await loadProducts(eventId).catch((e) => console.error(e.message))) || [];

		if (!products?.length) return conf.err.load;

		selection = products.filter((e) => productId === e.product.productId);
	}

	if (!selection?.length) return conf.err.data;

	return selection.pop();
}

async function loadProducts(eventId: string) {
	let query = ` {
	event(eventId:"${eventId}" locale: en) {
	  name
	  eventId
	  products {
		nodes {
			${gqlProductInfo}
		  }
		}
	  }
	}}
  `;

	let rawData = await fetchGql(query).catch((e) => {
		console.error(e.message);
	});

	if (!rawData || rawData.errors) return [];

	let products: any[] = [];

	let event = {
		eventId: rawData?.data?.event?.eventId,
		name: rawData?.data?.event?.name,
	};

	if (!event.eventId || !event.name) return [];

	rawData.data.event.products.nodes.forEach((el: any) => {
		if (!el.shortName) return;
		products.push(gqlNode2NtblData(event, el));
	});

	return products;
}

async function loadProduct(eventId: string, productId: string, exhibitorId: string) {
	let query = ` {
		event(eventId: "${eventId}", locale: en) {
	  name
	  eventId
	  product(productId: "${productId}", exhibitorId: "${exhibitorId}") {
			${gqlProductInfo}
		}
	  }
	}}
  `;

	let rawData = await fetchGql(query).catch((e) => {
		console.error(e.message);
	});

	if (!rawData || rawData.errors) {
		console.error(rawData);
		return null;
	}

	let event = {
		eventId: rawData?.data?.event?.eventId,
		name: rawData?.data?.event?.name,
	};

	if (!event.eventId || !event.name) return null;

	const product = rawData.data.event.product;

	if (!product.shortName) return;

	return gqlNode2NtblData(event, product);
}

function gqlNode2NtblData(event: any, el: any) {
	let {grapeVarieties, producer, bottleImage, labelImage, backLabelImage, ...product} = el;
	product.grape = grapeVarieties?.map((el: any) => el.varietyName).join(', ') || '';

	const imageUrl = bottleImage?.fixed?.src || labelImage?.fixed?.src || backLabelImage?.fixed?.src;
	if (imageUrl) product.imageUrl = imageUrl;

	return {
		event,
		product,
		producer,
	};
}

async function fetchGql(query = '', headers = {}) {
	const response = await fetch(conf.gqlUrl, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			...headers,
		},
		body: JSON.stringify({
			query,
		}),
	});

	const responseBody = await response.json();
	return responseBody;
}

/*"data": {
    "event": {
      "name": "Consorzio Chianti Classico Directory",
      "eventId": "5ed0a5de5ea7210f78aed1dc",
      "products": {
        "nodes": [
          {
            "productId": "5dc04f04c1355b2945f27aaa",
            "shortName": "Chianti Classico Fonterutoli",
            "vintage": "2018",
            "country": "Italy",
            "region": "Tuscany",
			"subregion": "Chianti Classico",
			"wineType": "Still wine",
			"wineColor": "Red",
            "grapeVarieties": [
              {
                "varietyName": "Sangiovese",
                "percentage": 90
              },
              {
                "varietyName": "Colorino",
                "percentage": 5
              },
              {
                "varietyName": "Malvasía",
                "percentage": 5
              }
			],
			"bottleImage": {
				"name": "Bottle Image",
				"fixed": {
					"src": "https://res.cloudinary.com/bottlebooks/image/upload/f_auto,h_1200,q_auto/v1/bottlebooks/5abc94bc9b2ce70a7e0b48bf/Castello_di_Fonterutoli-Mazzei-Chianti_Classico_DOCG_Fonterutoli-bottleImage-fonterutoli_senza_annata_trasp-5110.png"
				},
				"sourceUrl": "https://api.bottlebooks.me/pub/files/download?url=5abc94bc9b2ce70a7e0b48bf/Castello_di_Fonterutoli-Mazzei-Chianti_Classico_DOCG_Fonterutoli-bottleImage-fonterutoli_senza_annata_trasp-5110.png&name=Bottle Image"
				},
			"labelImage": {
				"name": "Front Label",
				"fixed": {
					"src": "https://res.cloudinary.com/bottlebooks/image/upload/f_auto,h_1200,q_auto/v1/bottlebooks/5abc94bc9b2ce70a7e0b48bf/Marchesi_Mazzei_Spa_Societa_Agricola-2016_Fonterutoli_Chianti_Classico-labelImage-Fonterutoli_2016_fronte-4125.jpg"
				},
				"sourceUrl": "https://api.bottlebooks.me/pub/files/download?url=5abc94bc9b2ce70a7e0b48bf/Marchesi_Mazzei_Spa_Societa_Agricola-2016_Fonterutoli_Chianti_Classico-labelImage-Fonterutoli_2016_fronte-4125.jpg&name=Front Label"
				},
			"backLabelImage": {
				"name": "Back Label",
				"fixed": {
					"src": "https://res.cloudinary.com/bottlebooks/image/upload/f_auto,h_1200,q_auto/v1/bottlebooks/5abc94bc9b2ce70a7e0b48bf/Marchesi_Mazzei_Spa_Societa_Agricola-2016_Fonterutoli_Chianti_Classico-backLabelImage-Fonterutoli_2016_750ml_EU_RT-6226.jpg"
				},
				"sourceUrl": "https://api.bottlebooks.me/pub/files/download?url=5abc94bc9b2ce70a7e0b48bf/Marchesi_Mazzei_Spa_Societa_Agricola-2016_Fonterutoli_Chianti_Classico-backLabelImage-Fonterutoli_2016_750ml_EU_RT-6226.jpg&name=Back Label"
				},
            "producer": {
              "name": "Castello di Fonterutoli - Marchesi Mazzei",
              "producerId": "5a95a0b06d08420bab548c73"
            }
          }, 
  */

export const stub = {
	status: 'success',
	message: 'Product info found',
	data: {
		event: {
			name: 'Consorzio Chianti Classico Directory',
			eventId: '5ed0a5de5ea7210f78aed1dc',
		},
		product: {
			productId: '5e58fac01dea651f170c030e',
			shortName: 'Chianti Classico Riserva Ser Lapo',
			vintage: '2017',
			country: 'Italy',
			region: 'Tuscany',
			subregion: 'Chianti Classico',
			grape: 'Sangiovese, Merlot',
			wineType: 'Still wine',
			wineColor: 'Red',
			imageUrl:
				'https://res.cloudinary.com/bottlebooks/image/upload/f_auto,h_1200,q_auto/v1/bottlebooks/5abc94bc9b2ce70a7e0b48bf/Castello_di_Fonterutoli-Mazzei-Chianti_Classico_DOCG_Fonterutoli-bottleImage-fonterutoli_senza_annata_trasp-5110.png',
		},
		producer: {
			name: 'Castello di Fonterutoli - Marchesi Mazzei',
			producerId: '5a95a0b06d08420bab548c73',
		},
	},
};
