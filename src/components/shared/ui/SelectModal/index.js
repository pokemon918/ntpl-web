import React from 'react';
import PropTypes from 'prop-types';
import './SelectModal.scss';
import Modal from '../Modal';
import SingleSelectorItem from '../SingleSelector/SingleSelectorItem';
import classnames from 'classnames';
import Grid from '../Grid';
import Button from '../Button';
import L18nText from '../../L18nText';

class SelectModal extends React.Component {
	render() {
		const {title, options, isOpen, onClose, selectedItem} = this.props;
		const selectModalClass = classnames('Select_Modal_Wrapper', {
			active: isOpen,
		});
		return (
			<div className={selectModalClass}>
				{isOpen && (
					<Modal
						title={title}
						body={
							<Grid columns={4}>
								<div className="Select_Modal_Block">
									<div className="Select_Modal_Items">
										{options.map((selectItem, index) => (
											<SingleSelectorItem
												type={'default'}
												key={index}
												id={selectItem}
												name={selectItem}
												hideArrow={true}
												onSelect={() => selectedItem(selectItem)}
											/>
										))}
									</div>
								</div>
							</Grid>
						}
						onClose={onClose}
						footer={
							<div className="SelectModal_Footer_Wrapper">
								<Button onHandleClick={onClose}>
									<L18nText id={'app_cancel'} />
								</Button>
							</div>
						}
					/>
				)}
			</div>
		);
	}
}

SelectModal.propTypes = {
	options: PropTypes.array.isRequired,
	onClose: PropTypes.func.isRequired,
	title: PropTypes.string,
	isOpen: PropTypes.bool,
};

export default SelectModal;
