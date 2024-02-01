import React from 'react';
import PropTypes from 'prop-types';

import SingleSelector from 'components/shared/ui/SingleSelector';

import Modal from '../Modal';
import Button from '../Button';
import L18nText from 'components/shared/L18nText';
import Grid from '../Grid';
import Spinner from '../Spinner';

import './Dropover.scss';

const Dropover = ({title, loadingState, options, onSelect, onClose, selected, hideDescription}) => {
	const hasLoaded = !loadingState || loadingState === 'success';
	return (
		<Modal
			onClose={onClose}
			title={title}
			isFixed
			body={
				<Grid columns={4}>
					<div className="Dropover__Container">
						{loadingState === 'loading' && (
							<div className="Dropover__Status">
								<Spinner inline />
							</div>
						)}
						{loadingState === 'error' && (
							<div className="Dropover__Status">
								<L18nText id="error_load_options" />
							</div>
						)}
						{hasLoaded && options.length === 0 && (
							<div className="Dropover__Status">
								<L18nText id="info_no_options_available" />
							</div>
						)}
						{hasLoaded && options.length > 0 && (
							<SingleSelector
								type="default"
								items={options}
								onSelect={onSelect}
								hideArrow={true}
								selected={selected}
								hideDescription={hideDescription}
							/>
						)}
					</div>
				</Grid>
			}
			footer={
				<div className="pd-10">
					<Button variant="outlined" onHandleClick={onClose}>
						<L18nText id="app_close" defaultMessage="Close" />
					</Button>
				</div>
			}
		/>
	);
};

Dropover.propTypes = {
	title: PropTypes.string,
	options: PropTypes.array,
	onSelect: PropTypes.func,
	onClose: PropTypes.func,
	selected: PropTypes.object,
};

export default Dropover;
