import React, {Component} from 'react';
import {connect} from 'react-redux';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

import {routeConstants} from 'const';
import Grid from 'components/shared/ui/Grid';
import {fetchWines} from 'actions/wineActions';
import L18nText from 'components/shared/L18nText';
import Button from 'components/shared/ui/Button';
import AddWine from 'components/events/addWine';

import './WineList.scss';
import {withRouter} from 'react-router';
import {getLinkWithArguments} from 'commons/commons';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

const grid = 7;

const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: `${grid * 2}px 0`,
	margin: `0 15px ${grid}px 15px`,
	background: isDragging && '#d7d2db',
	// styles we need to apply on draggables
	...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
	border: '1px #dbdacd solid',
});

class WineList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			items: [],
			type: 'add',
			selectedWine: {},
		};
		this.onDragEnd = this.onDragEnd.bind(this);
	}

	componentDidMount() {
		this.initWines();
	}

	goToWineDetails = (wineRef) => {
		this.props.history.replace(getLinkWithArguments(routeConstants.TASTING_RESULT_REF, {wineRef}));
	};

	goToAddWine = (wine) => {
		this.setState({showAddWine: true, selectedWine: wine, type: wine ? 'edit' : 'add'});
	};

	async initWines() {
		const sortBy = this.props.wines.sortBy;
		await this.props.fetchWines(sortBy, this.props.history);

		const wines = this.props.wines.data
			? this.props.wines.data.map((wine, index) => ({...wine, id: `#${index + 1}`}))
			: [];

		this.setState({items: wines});
	}

	onCloseHandle = () => {
		this.setState({showAddWine: false});
	};

	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const items = reorder(this.state.items, result.source.index, result.destination.index);

		this.setState({
			items,
		});
	}

	// Normally you would want to split things out into separate components.
	// But in this example everything is just done in one place for simplicity
	render() {
		const {showAddWine, selectedWine, type} = this.state;

		return (
			<div className="WineTable__Wrapper">
				{showAddWine && <AddWine onClose={this.onCloseHandle} wine={selectedWine} type={type} />}
				<Grid columns={12}>
					<div className="WineList__Title">What to taste</div>
				</Grid>
				<div className="WineList__Wine__Info">
					<Grid columns={12}>
						<div className="WineList__Wine__Description"></div>
						<div className="WineList__Add__Wine">
							<Button
								infoKey="nav_newTasting"
								variant="outlined"
								onHandleClick={() => this.goToAddWine(null)}
							>
								<L18nText id="wine_add" defaultMessage="Add Wine" />
							</Button>
						</div>
					</Grid>
				</div>
				<Grid columns={12}>
					<DragDropContext onDragEnd={this.onDragEnd}>
						<Droppable droppableId="droppable">
							{(provided, snapshot) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									style={getListStyle(snapshot.isDraggingOver)}
								>
									<div className="WineList__Header">
										<div className="WineList__Id"></div>
										<div className="WineList__Alias">Alias</div>
										<div className="WineList__Name">Name</div>
										<div className="WineList__Vintage">Vintage</div>
										<div className="WineList__Producer">Producer</div>
										<div className="WineList__Country">Country</div>
										<div className="WineList__Region">Region</div>
									</div>
									<div className="WineList__Container">
										{this.state.items.map((item, index) => (
											<Draggable key={item.ref} draggableId={item.ref} index={index}>
												{(provided, snapshot) => (
													<div
														onClick={() => this.goToAddWine(item)}
														className="WineList__Wrapper"
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
													>
														<div className="WineList__Id">{item.id ? item.id : '-'}</div>
														<div className="WineList__Alias">{item.name ? item.name : '-'}</div>
														<div className="WineList__Name">{item.name ? item.name : '-'}</div>
														<div className="WineList__Vintage">
															{item.vintage ? item.vintage : '-'}
														</div>
														<div className="WineList__Producer">
															{item.producer ? item.producer : '-'}
														</div>
														<div className="WineList__Country">
															{item.country ? item.country : '-'}
														</div>
														<div className="WineList__Region">
															{item.region ? item.region : '-'}
														</div>
													</div>
												)}
											</Draggable>
										))}
									</div>
								</div>
							)}
						</Droppable>
					</DragDropContext>
				</Grid>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		app: state.app,
		wines: state.wines,
		user: state.user,
	};
}

export default connect(mapStateToProps, {fetchWines})(withRouter(WineList));
