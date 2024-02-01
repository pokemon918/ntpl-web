import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import L18nText from 'components/shared/L18nText';

import Button from 'components/shared/ui/Button';
import Grid from 'components/shared/ui/Grid';

import CloseIcon from './icon_close.png';
import './DialogBox.scss';

class DialogBox extends React.Component {
	n = 99999;

	render() {
		const {
			title,
			additionalData = {},
			description,
			renderBody,
			children,
			aspect,
			onClose,
			noText,
			yesText,
			noCallback,
			yesCallback,
			disableButtons,
			errorBox,
			width,
			customFooter,
			errorButtonText,
			reverseButtons,
			hideCloseButton,
			hideBtn,
		} = this.props;

		return (
			<div className="DialogBox__Wrapper">
				<>
					<Grid columns={width || 6}>
						<div
							className={classNames('DialogBox__Modal', [aspect])}
							style={
								{'z-index': ++this.n} /* MRW: Attempt to let each modal go on top of each other */
							}
						>
							<div className="DialogBox__Container">
								<div className={classNames('DialogBox__Container__Header')}>
									{title && (
										<div className="DialogBox__Title">
											<L18nText id={title} defaultMessage={title}>
												{(key) => <span data-test={title}>{key}</span>}
											</L18nText>
										</div>
									)}
									{!hideBtn && (
										<div
											className={classNames('DialogBox__Container__CloseButton', {
												disabled: disableButtons,
											})}
											onClick={onClose || noCallback}
										>
											<img src={CloseIcon} alt="close-icon" data-testid="closeIcon" />
										</div>
									)}
								</div>
								<div className="DialogBox__Container__Body">
									<div className="DialogBox__Container__BodyContent">
										{description && (
											<L18nText
												id={description}
												defaultMessage={description}
												values={additionalData}
											/>
										)}
										{typeof renderBody === 'function' ? renderBody() : null}
										{children}
									</div>
								</div>
							</div>
							{!hideBtn && (
								<div className="DialogBox__Container__FooterWrapper">
									{customFooter ? (
										customFooter
									) : (
										<div
											className={classNames('DialogBox__Container__FooterContainer', {
												reverseButtons,
											})}
										>
											{errorBox ? (
												<Button infoKey="DialogBox__closeBtn" onHandleClick={noCallback}>
													<L18nText id={errorButtonText} />
												</Button>
											) : (
												<>
													<Button
														infoKey="DialogBox__yesBtn"
														variant={'outlined'}
														disabled={disableButtons}
														onHandleClick={yesCallback}
													>
														<L18nText id={yesText} defaultMessage={'Yes'} />
													</Button>
													{!hideCloseButton && (
														<Button
															infoKey="DialogBox__noBtn"
															disabled={disableButtons}
															onHandleClick={noCallback}
														>
															<L18nText id={noText} defaultMessage={'No'} />
														</Button>
													)}
												</>
											)}
										</div>
									)}
								</div>
							)}
						</div>
					</Grid>
					<div className="DialogBox__Backdrop" onClick={onClose || noCallback} />
				</>
			</div>
		);
	}
}

DialogBox.propTypes = {
	errorBox: PropTypes.bool,
	title: PropTypes.string.isRequired,
	additionalData: PropTypes.shape({}),
	description: PropTypes.string,
	errorButtonText: PropTypes.string,
	children: PropTypes.node,
	aspect: PropTypes.oneOf(['normal', 'wide']),
	noText: PropTypes.string,
	yesText: PropTypes.string,
	noCallback: PropTypes.func.isRequired,
	yesCallback: PropTypes.func.isRequired,
	disableButtons: PropTypes.bool,
	reverseButtons: PropTypes.bool,
	outlinedYesButton: PropTypes.bool,
	hideCloseButton: PropTypes.bool,
};

DialogBox.defaultProps = {
	aspect: 'normal',
	errorButtonText: 'app_close',
	noText: 'app_no',
	yesText: 'app_yes',
};

export default DialogBox;
