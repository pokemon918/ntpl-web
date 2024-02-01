import React from 'react';
import classnames from 'classnames';

import './ProfileBanner.scss';
import L18nText from 'components/shared/L18nText';
import defaultPicture from './default_picture.png';
import Grid from '../Grid';
import {truncate} from 'commons/commons';
import wineKnowledgeList from 'assets/json/wine_knowledge.json';

class ProfileBanner extends React.Component {
	constructor(props) {
		super(props);
		this.uploadInput = React.createRef();
	}

	openFileBrowser = () => {
		if (!this.props.isLoading) {
			this.uploadInput.current.click();
		}
	};

	onChangePic = () => {
		const target = this.uploadInput.current;

		this.props.onUpdateImage(target.files);
	};

	render() {
		const {
			isLoading,
			mustLoginAgain,
			userData: {avatar, gravatar, name, wine_knowledge},
			serverUrl,
		} = this.props;

		const profileImg = classnames('ProfileBanner__ProfileImg', {
			loading: isLoading,
		});

		let profilePicUrl = '';
		let gravatarUrl = '';
		let wineKnowledge = '';

		if (gravatar) {
			gravatarUrl = `https://secure.gravatar.com/avatar/${gravatar}?s=64&d=`;

			if (/localhost/i.test(window.location.origin)) {
				gravatarUrl += 'mm';
				gravatarUrl = '/app/avatar.png';
			} else {
				gravatarUrl += encodeURIComponent(`${window.location.origin}/app/avatar.png`);
			}
			//gravatarUrl = `https://robohash.org/${gravatar}?size=60x60&set=set1&gravatar=hashed`;
		}

		if (avatar) {
			profilePicUrl = `${serverUrl}/images/${avatar}`;
		}

		if (wine_knowledge) {
			wineKnowledge = wineKnowledgeList.wine_knowledge_list.find(
				(wine) => wine.title_key === wine_knowledge
			);
		}

		return (
			<div className="ProfileBanner__Wrapper">
				<div className="ProfileBanner__Header">
					<div className="ProfileBanner__Header__Background">
						<Grid columns={10}>
							<div className="ProfileBanner__Content">
								<div className="ProfileBanner__Header__Title">
									<h1>
										<L18nText id="nav_profile" defaultMessage="Profile" />
									</h1>
								</div>
								{!mustLoginAgain && (
									<div className="ProfileBanner__Img__Wrapper">
										{isLoading && (
											<div className="ProfileBanner__Loading">
												<L18nText id={'app_loading'} defaultMessage={'Loading'} />
											</div>
										)}
										<input
											type="file"
											ref={this.uploadInput}
											id="multi"
											hidden
											accept="image/*"
											onChange={this.onChangePic}
										/>
										<div className="ProfileBanner__ProfileInfo">
											<div className="ProfileInfo__Name">{truncate(name) || 'Your profile'}</div>
											{/* Hiding company info */}
											{/* <div className="ProfileInfo__Company">Noteable Wine Company</div> */}
											{wineKnowledge && (
												<div className="ProfileInfo__Wine">
													<L18nText
														id={wineKnowledge.title_key}
														defaultMessage={wineKnowledge.description}
													/>
												</div>
											)}
										</div>
										<div className={profileImg} onClick={this.openFileBrowser}>
											{!isLoading && (
												<div className="ProfileBanner__Change">
													<L18nText id={'app_change'} defaultMessage={'Change'} />
												</div>
											)}
											<div>
												<img
													src={profilePicUrl || gravatarUrl || defaultPicture}
													alt="avatar"
													height="64"
													width="64"
												/>
											</div>
										</div>
									</div>
								)}
							</div>
						</Grid>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfileBanner;
