import React from 'react';
import classNames from 'classnames';
import {Link} from 'react-router-dom';

import './Button.scss';

const availableStyles = {
	default: 'Button__Default',
	outlined: 'Button__Outlined',
	inverse: 'Button__Inverse',
	secondary: 'Button__Secondary',
	transparent: 'Button__Transparent',
	reverse: 'Button__Reverse',
	icon: 'Button__Icon',
};

const availableSizes = {
	normal: 'Size--normal',
	small: 'Size--small',
};

type ButtonVariants =
	| 'default'
	| 'outlined'
	| 'inverse'
	| 'secondary'
	| 'transparent'
	| 'reverse'
	| 'icon';

type ButtonSizes = 'normal' | 'small';

const getButtonStyle = (variant: ButtonVariants) =>
	availableStyles[variant] || availableStyles.default;

interface Props {
	onHandleClick?: (event: MouseEvent) => void;
	children: React.ReactNode;
	disabled?: boolean;
	variant?: ButtonVariants;
	size?: ButtonSizes;
	infoKey?: string;
	type?: string;
	redirectToOtherDomain?: boolean;
	linkTo?: string;
	id?: string;
	linkTarget?: string;
	class?: string;
	className?: string;
	classNames?: string;
}

const Button = ({
	onHandleClick,
	children,
	disabled,
	id,
	variant = 'default',
	size = 'normal',
	infoKey,
	type,
	redirectToOtherDomain,
	linkTo,
	linkTarget,
	className,
}: Props) => {
	const getButtonSize = (size: ButtonSizes) => availableSizes[size] || availableSizes.normal;
	const isLink = !!linkTo;

	if (redirectToOtherDomain) {
		return (
			<a
				href={linkTo}
				className={[classNames('Button', [getButtonStyle(variant), getButtonSize(size)]), className]
					.filter(Boolean)
					.join(' ')}
				data-test={infoKey}
				target={linkTarget}
				rel={isLink && linkTarget === '_blank' ? 'noopener noreferrer' : ''}
			>
				{children}
			</a>
		);
	}

	const tagProps: any = {
		type: !isLink ? type || 'button' : null,
		id: id,
		className: [classNames('Button', [getButtonStyle(variant), getButtonSize(size)]), className]
			.filter(Boolean)
			.join(' '),
		disabled,
		onClick: onHandleClick,
		'data-test': infoKey,
		// create links with button styles
		to: isLink ? linkTo : null,
		target: isLink ? linkTarget : null,
		rel: isLink && linkTarget === '_blank' ? 'noopener noreferrer' : null,
	};

	if (isLink) {
		return <Link {...tagProps}>{children}</Link>;
	}

	return <button {...tagProps}>{children}</button>;
};

export default Button;
