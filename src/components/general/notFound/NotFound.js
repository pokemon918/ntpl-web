import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './NotFound.scss';
import Grid from 'components/shared/ui/Grid';
import {FaLongArrowAltLeft} from 'react-icons/fa';

export default class NotFound extends Component {
	render() {
		return (
			<div className="NotFound__Container">
				<Grid columns={8}>
					<div className="NotFound__Text">
						<h2 className="Title">Oh... Too much wine?</h2>
						<div className="Description"> Error 404: We couldn’t find the page.</div>
						<Link to="/">
							<FaLongArrowAltLeft className="arrow-icon" />
							{'  '}
							To the frontpage
						</Link>
					</div>
				</Grid>
			</div>
		);
	}
}
