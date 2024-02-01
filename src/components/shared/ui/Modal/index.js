import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import L18nText from 'components/shared/L18nText';
import Breadcrumb from '../Breadcrumb';
import ModalContext from './Context';
import CloseIcon from './icon_close.png';
import './Modal.scss';

class Modal extends React.Component {
	constructor(props) {
		super(props);
		// this.modalBody = React.createRef();
		this.state = {
			height: 0,
			hasMoreContent: false,
		};
		this.modalBody = null;
		this.setShadowClassOnResize = this.setShadowClassOnResize.bind(this);
	}

	onHandleClose = () => {
		this.props.onClose();
	};

	componentDidMount() {
		document.body.style.overflowY = 'hidden';
		window.addEventListener('resize', this.setShadowClassOnResize);
	}

	componentWillUnmount() {
		document.body.style.overflowY = 'scroll';
		window.removeEventListener('resize', this.setShadowClassOnResize);
	}

	setShadowClassOnResize() {
		const {hasMoreContent} = this.state;
		if (
			this.modalBody &&
			this.modalBody.getBoundingClientRect().height < this.modalBody.scrollHeight &&
			!hasMoreContent
		)
			this.setState({hasMoreContent: true});
		else if (
			this.modalBody &&
			this.modalBody.getBoundingClientRect().height >= this.modalBody.scrollHeight &&
			hasMoreContent
		)
			this.setState({hasMoreContent: false});
	}

	setShadowClass(el) {
		const {hasMoreContent} = this.state;
		this.modalBody = el;
		if (el && el.getBoundingClientRect().height < el.scrollHeight && !hasMoreContent)
			this.setState({hasMoreContent: true});
		else if (el && el.getBoundingClientRect().height >= el.scrollHeight && hasMoreContent)
			this.setState({hasMoreContent: false});
	}

	render() {
		const {
			hideOriginalTitle,
			title,
			body,
			footer,
			isFixed,
			headerAddon,
			progressBar,
			titleScholar,
			boldLastText,
			subTitleScholar,
			fixedBreadcrumb,
		} = this.props;
		const {hasMoreContent} = this.state;

		return (
			<ModalContext.Wrapper>
				{({title: innerTitle, subTitle, breadcrumb}) => {
					const breadcrumbText = fixedBreadcrumb || breadcrumb;

					return (
						<div className={classNames('Modal__Wrapper', {hasMoreContent, isFixed})}>
							<div
								className={classNames('Modal__Container__Header', {
									emptyHeader: !title && !innerTitle && !subTitle && !headerAddon,
								})}
							>
								{progressBar && progressBar()}
								<div className="Modal__Controls__Wrapper">
									<div className="Modal__Controls__Container">
										{breadcrumbText && (
											<Breadcrumb path={breadcrumbText} boldLastText={boldLastText} />
										)}
										<div
											className="Modal__Container__CloseButton"
											data-test="Modal__closeBtn"
											onClick={this.onHandleClose}
										>
											<img src={CloseIcon} alt="close-icon" />
										</div>
									</div>
								</div>
								{((title && !innerTitle) || titleScholar) && (
									<h1>
										<L18nText id={title || titleScholar} defaultMessage={title || titleScholar}>
											{(key) => <span data-test={title || titleScholar}>{key}</span>}
										</L18nText>
									</h1>
								)}

								{subTitleScholar && (
									<div className="Modal__Container__Header_SubTitle">{subTitleScholar}</div>
								)}

								{innerTitle && !hideOriginalTitle && (
									<div className="Modal__Container__Header_Title">
										<L18nText id={innerTitle} defaultMessage={innerTitle}>
											{(key) => <span data-test={innerTitle}>{key}</span>}
										</L18nText>
									</div>
								)}

								{subTitle && (
									<h2>
										<L18nText id={subTitle} defaultMessage={subTitle} />
									</h2>
								)}
								{headerAddon && <div className="Modal__Container__HeaderAddon">{headerAddon}</div>}
							</div>
							<div
								ref={(el) => this.setShadowClass(el)}
								id="modal_body"
								className="Modal__Container__Body"
							>
								<div className="Modal__Container__BodyContent">{body}</div>
							</div>
							{footer && (
								<>
									<div className="Modal__Container__FooterWrapper">
										<div className="Modal__Container__FooterContainer">{footer}</div>
									</div>
									<div className="Modal__Container__MoreContent" />
								</>
							)}
						</div>
					);
				}}
			</ModalContext.Wrapper>
		);
	}
}

const FooterLeft = ({children, className}) => (
	<div className={classNames('Modal__Container__FooterLeft', [className])}>{children}</div>
);

const FooterRight = ({children, className}) => (
	<div className={classNames('Modal__Container__FooterRight', [className])}>{children}</div>
);

Modal.propTypes = {
	headerAddon: PropTypes.node,
	footer: PropTypes.node,
	body: PropTypes.node.isRequired,
	onClose: PropTypes.func.isRequired,
	hideOriginalTitle: PropTypes.bool,
	hideBreadcrumb: PropTypes.bool,
	title: PropTypes.string,
};

Modal.Title = ModalContext.Title;
Modal.SubTitle = ModalContext.SubTitle;
Modal.Breadcrumb = ModalContext.Breadcrumb;
Modal.FooterLeft = FooterLeft;
Modal.FooterRight = FooterRight;

export default Modal;
