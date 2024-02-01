import React, {Component} from 'react';
import {connect} from 'react-redux';

import {updateSelectedItem} from 'actions/multiStepFormActions';
import Grid from 'components/shared/ui/Grid';
import Modal from 'components/shared/ui/Modal';
import CommentArea from '../partials/CommentArea';
import {tastingTypesWithDetailedNotes} from './notes';

import comments from 'assets/json/tasting/comments.json';

class CommentStep extends Component {
	constructor(props) {
		super(props);
		this.updateSelectedComments = this.updateSelectedComments.bind(this);
	}

	updateSelectedComments(value) {
		this.props.updateSelectedItem('comments', value);
	}

	getCommentAreas() {
		const {multiStepForm, online} = this.props;
		let commentsKey = comments.keys[0];
		let tastingSrc = multiStepForm.tastingSrc;
		let selectedItems = multiStepForm.selectedItems;
		let commentData = multiStepForm.selectedItems.comments;

		let commentAreas = tastingSrc[commentsKey].map((commentName, index) => {
			return (
				<div key={index} className="comment-area-wrapper">
					<CommentArea
						commentKey={commentName}
						selectedItems={selectedItems}
						commentCallBack={this.updateSelectedComments}
						content={commentData ? commentData[commentName] : ''}
						showControls={commentName === 'wine_personal' ? false : true}
						online={online}
					/>
				</div>
			);
		});

		return commentAreas;
	}

	render() {
		const {
			multiStepForm: {tastingType},
		} = this.props;
		let breadcrumb = '';
		breadcrumb = `tasting_observations / tasting_comments`;
		if (tastingTypesWithDetailedNotes.includes(tastingType)) {
			breadcrumb = `${tastingType}_ / tasting_observations / tasting_comments`;
		}

		return (
			<Grid columns={6}>
				<div className="step-container comments-step">
					<Modal.Breadcrumb path={breadcrumb} />
					<Modal.Title text="tasting_comments" />
					<div className="container">{this.getCommentAreas()}</div>
				</div>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	const {
		app,
		multiStepForm,
		offline: {online},
	} = state;

	return {
		app,
		multiStepForm,
		online,
	};
}

export default connect(mapStateToProps, {updateSelectedItem})(CommentStep);
