import React, {PureComponent} from 'react';
import {connect} from 'react-redux';

import {fetchNavbar} from 'actions/appActions';
import SiteMenu from 'components/shared/ui/SiteMenu';

let loaded = false;
class ConnectedSiteMenu extends PureComponent {
	componentDidMount() {
		if (loaded) return;
		loaded = true;
		this.props.fetchNavbar();
	}

	render() {
		const {navBar, ...ownProps} = this.props;
		return <SiteMenu navBar={navBar} {...ownProps} />;
	}
}

const mapStateToProps = (state) => ({
	navBar: state.navBar.data,
});

export default connect(mapStateToProps, {fetchNavbar})(ConnectedSiteMenu);
