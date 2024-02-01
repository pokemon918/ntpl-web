import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {FaCircle} from 'react-icons/fa';

import {readErrorLog} from 'actions/appActions';
import L18nText from 'components/shared/L18nText';
import Button from 'components/shared/ui/Button';
import DialogBox from 'components/shared/ui/DialogBox';
import './Logs.scss';

const PAGE_SIZE = 25;

const sortByTime = (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime();

const autoFormatDate = (date) => new Date(date).toLocaleString();

const stripHostname = (path = '') => path.replace(/^https?:\/\/[^/]+/, '');

const stripQueryString = (path = '') =>
	path.includes('?') ? path.substr(0, path.indexOf('?')) : path;

const getOnlyEndpoint = (path = '') => stripQueryString(stripHostname(path));

const getQueryParameters = (path = '') =>
	path.includes('?')
		? path
				.substr(path.indexOf('?') + 1)
				.split('&')
				.map((p) => {
					const [key, value] = p.split('=');
					return {key, value};
				})
		: [];

const stringifyJson = (src, beautify) => {
	const obj = typeof src === 'string' ? JSON.parse(src) : src;
	const json = JSON.stringify(obj, null, beautify ? 2 : null);
	return json;
};

const Code = ({src, beautify}) => (
	<pre>
		<code>{stringifyJson(src, beautify)}</code>
	</pre>
);

const Logs = ({logs, readErrorLog}) => {
	const [logDetails, setLogDetails] = useState(null);
	const [countVisible, setCountVisible] = useState(PAGE_SIZE);

	const openLogDetails = (details) => {
		if (!details.read) readErrorLog(details.ref);
		setLogDetails(details);
	};

	const closeLogDetails = () => {
		setLogDetails(null);
	};

	const loadMore = () => {
		setCountVisible(countVisible + PAGE_SIZE);
	};

	return (
		<div className="DevLogs__Container">
			<h2>
				<L18nText id="log_logs" defaultMessage="Logs" />
			</h2>
			<table className="DevLogs__Table">
				<thead>
					<th>
						<L18nText id="log_time" defaultMessage="Time" />
					</th>
					<th>
						<L18nText id="log_referral" defaultMessage="Referral" />
					</th>
					<th>
						<L18nText id="log_endpoint" defaultMessage="Endpoint" />
					</th>
					<th>
						<L18nText id="log_status" defaultMessage="Status" />
					</th>
					<th>
						<L18nText id="log_error" defaultMessage="Error" />
					</th>
				</thead>
				<tbody>
					{logs
						.sort(sortByTime)
						.slice(0, countVisible)
						.map((details) => {
							const {ref, read, time, referral, status, request, error} = details;
							return (
								<tr key={ref} onClick={() => openLogDetails(details)}>
									<td>
										<div className="DevLogs__CenterContent">
											{autoFormatDate(time)}
											{!read && (
												<span className="DevLogs__UnreadIndicator">
													<FaCircle />
												</span>
											)}
										</div>
									</td>
									<td>
										<code>{stripHostname(referral)}</code>
									</td>
									<td>
										{request.options.method} <code>{getOnlyEndpoint(request.path)}</code>
									</td>
									<td>{status}</td>
									<td>
										<Code src={error} />
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
			{(!logs || !logs.length) && (
				<div className="DevLogs__EmptyMessage">
					<L18nText id="log_no_logs" defaultMessage="No logs to display" />
				</div>
			)}
			{logs && logs.length > countVisible && (
				<div className="ActionButtons">
					<p>
						<L18nText
							id="log_displaying_entries"
							defaultMessage="Displaying {countVisible} out of {logsLength} entries"
							values={{countVisible, logsLength: logs.length}}
						/>
					</p>
					<Button variant="outlined" onHandleClick={loadMore}>
						<L18nText id="logs_load_more" defaultMessage="Load more" />
					</Button>
				</div>
			)}
			{logDetails && (
				<DialogBox title="log_details" noCallback={closeLogDetails} aspect="wide" errorBox>
					<div className="DevLogs__Details">
						<div>
							<strong>
								<L18nText id="log_time" defaultMessage="Time" />:
							</strong>{' '}
							{autoFormatDate(logDetails.time)}
						</div>
						<div>
							<strong>
								<L18nText id="log_actiontype" defaultMessage="Action Type" />:
							</strong>{' '}
							<code>{logDetails.actionType}</code>
						</div>
						<div>
							<strong>
								<L18nText id="log_referral" defaultMessage="Referral" />:
							</strong>{' '}
							{logDetails.referral}
						</div>
						<div>
							<strong>
								<L18nText id="log_endpoint" defaultMessage="Endpoint" />:
							</strong>{' '}
							{logDetails.request.options.method} {stripQueryString(logDetails.request.path)}
						</div>
						<div>
							<strong>
								<L18nText id="log_queryparams" defaultMessage="Query Parameters" />:
							</strong>
							<ul>
								{getQueryParameters(logDetails.request.path).map((li) => (
									<li key={li.key}>
										<strong>{li.key}</strong>: <code>{li.value}</code>
									</li>
								))}
							</ul>
						</div>
						<div>
							<strong>
								<L18nText id="log_request_payload" defaultMessage="Request Payload" />:
							</strong>
							<Code src={logDetails.request.options.body} beautify />
						</div>
						<div>
							<strong>
								<L18nText id="log_response_status" defaultMessage="Response Status" />:
							</strong>{' '}
							{logDetails.status}
						</div>
						<div>
							<strong>
								<L18nText id="log_response_error" defaultMessage="Response Error" />:
							</strong>
							<Code src={logDetails.error} beautify />
						</div>
					</div>
				</DialogBox>
			)}
		</div>
	);
};

Logs.propTypes = {
	logs: PropTypes.arrayOf(
		PropTypes.shape({
			//
		})
	),
	readErrorLog: PropTypes.func,
};

Logs.defaultProps = {
	logs: [],
	readErrorLog: () => {},
};

const mapStateToProps = (state) => ({
	logs: state.app.logs,
});

export default connect(mapStateToProps, {readErrorLog})(Logs);
