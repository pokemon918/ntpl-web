import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Redirect} from 'react-router-dom';

import {redirect, getLinkWithArguments} from 'commons/commons';
import Grid from 'components/shared/ui/Grid';
import {setSkipSelectPlan} from 'actions/appActions';
import {fetchMarkedTastings} from 'actions/userActions';
import {fetchWines} from 'actions/wineActions';
import L18nText from 'components/shared/L18nText';
import Button from 'components/shared/ui/Button';
import Spinner from 'components/shared/ui/Spinner';
import {routeConstants, appConstants} from 'const';
import WineList from 'components/shared/ui/WineList';
import WineFilter from 'components/shared/ui/WineFilter';

import {IWinesStore} from 'types/wines';

import './MyWines.scss';

interface OwnProps {
	history: any;
}

interface StateProps {
	app: any;
	subscription: any;
	user: any;
	wines: IWinesStore;
	activePlan: string;
}

interface DispatchProps {
	fetchWines: (sortBy: string, history: any) => void;
	fetchMarkedTastings: () => void;
	setSkipSelectPlan: () => void;
}

type Props = OwnProps & StateProps & DispatchProps;

class MyWines extends Component<Props> {
	componentDidMount() {
		this.initWines();
		this.loadMarkedTastings();
		this.disableSkipSelectPlan();
	}

	async initWines() {
		const {sortBy} = this.props.wines;
		try {
			await this.props.fetchWines(sortBy, this.props.history);
		} catch (err) {
			this.setState({setState: false});
		}
	}

	loadMarkedTastings() {
		this.props.fetchMarkedTastings();
	}

	disableSkipSelectPlan = () => {
		if (this.props.subscription && this.props.subscription.skipSelectPlan) {
			this.props.setSkipSelectPlan();
		}
	};

	goToWineDetails = (wineRef: string) => {
		redirect(
			this.props.history,
			getLinkWithArguments(routeConstants.TASTING_RESULT_REF, {wineRef})
		);
	};

	get wines() {
		const {wines} = this.props;
		let content = <></>;

		if ((wines.data == null || wines.data.length <= 0) && wines.error === null) {
			content = (
				<div>
					<h1 data-test="wine_tasting_list_title">
						<L18nText id="wine_tasting_list_title" defaultMessage="My Tastings" />
					</h1>
					<div className="MyWines__Text links">
						<L18nText id="wine_no_tasting" defaultMessage="No tastings yet." />
						<Link to={routeConstants.TASTING}>
							&nbsp;
							<L18nText id="wine_click_here" defaultMessage="Click here" />
							&nbsp;
						</Link>
						<L18nText id="wine_start_new" defaultMessage="to start a new tasting." />
					</div>
				</div>
			);
		}

		if (wines.error) {
			content = (
				<div className="MyWines__Error">
					{wines.error && !wines.isLoading && (
						<>
							<div className="MyWines__Error_Title">
								<L18nText
									id="tasting_fetch_rejected"
									defaultMessage="Failed to load your tastings!"
								/>
							</div>

							<Button onHandleClick={this.initWines.bind(this)}>
								<L18nText id="try_again" defaultMessage="Try Again" />
							</Button>
						</>
					)}
				</div>
			);
		}

		if (wines.data && wines.data.length) {
			content = (
				<div>
					<h1 className="title-header center" data-test="wine_tasting_list_title">
						<L18nText id="wine_tasting_list_title" defaultMessage="My Tastings" />
					</h1>

					<WineFilter wines={wines.data}>
						{({wines}: any) => <WineList wines={wines} onClickWine={this.goToWineDetails} />}
					</WineFilter>
				</div>
			);
		}

		return content;
	}

	render() {
		const {wines, activePlan} = this.props;

		if (activePlan === appConstants.SUBSCRIBE) {
			return <Redirect to={routeConstants.SUBSCRIPTION} />;
		}

		return (
			<div className="MyWines__Container">
				{wines.isLoading && <Spinner />}
				{!wines.isLoading && <Grid columns={5}>{this.wines}</Grid>}
			</div>
		);
	}
}

function mapStateToProps(state: StateProps) {
	return {
		app: state.app,
		subscription: state.app.subscription,
		user: state.user,
		wines: state.wines,
		activePlan: state.user.activePlan,
	};
}

const mapDispatchToProps: DispatchProps = {
	fetchWines,
	fetchMarkedTastings,
	setSkipSelectPlan,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyWines);
