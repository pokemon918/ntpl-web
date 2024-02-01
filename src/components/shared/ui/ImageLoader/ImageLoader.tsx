import React, {useState, FC} from 'react';

import DefaultImage from 'assets/images/no-image.jpg';

interface Props {
	src: string;
	alt: string;
}

const ImageLoader: FC<Props> = ({src, alt}) => {
	const [error, setError] = useState(false);

	if (!src || error) {
		return <img src={DefaultImage} alt={alt} />;
	}

	return <img src={src} alt={alt} onError={() => setError(true)} />;
};

export default ImageLoader;
