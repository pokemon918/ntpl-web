import React, {FC} from 'react';

const textParagraphs = [
	'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis volutpat dolor. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur posuere rutrum faucibus. Phasellus sollicitudin feugiat leo, a ornare risus auctor in. Aenean eu mauris et ligula cursus scelerisque in eu metus. Nullam tristique sit amet diam ac ultricies. Nunc tincidunt accumsan dui ut pretium. Aliquam ut velit vitae dolor maximus commodo. Vivamus porttitor dapibus nisi, at molestie tellus ultrices nec.',
	'Duis bibendum id est a ultrices. Nunc at ipsum id risus accumsan maximus vel quis purus. Aliquam pulvinar mollis scelerisque. Vivamus vulputate tincidunt tellus nec venenatis. Nullam fermentum id lacus id bibendum. Duis pharetra nibh vel lacinia cursus. Phasellus velit augue, mattis ut ex vel, convallis convallis orci. Phasellus vehicula dapibus est, eu bibendum purus dapibus sit amet. Etiam nibh magna, pulvinar a lectus at, varius consequat arcu. Sed ornare ultricies lectus, ut tincidunt turpis tempus vel. In suscipit arcu turpis, ornare efficitur libero lobortis id. Sed id imperdiet eros, et molestie ex. Sed venenatis lorem ac volutpat tincidunt. Vivamus vel finibus turpis.',
	'In at felis id neque faucibus bibendum sit amet auctor libero. Mauris blandit, lorem nec pretium dictum, diam nunc maximus ligula, quis vestibulum eros arcu nec lectus. Pellentesque nibh turpis, consectetur nec ipsum eu, luctus porttitor tortor. Nullam egestas ante consectetur tempus elementum. Suspendisse porta vestibulum metus, eu rutrum ligula dignissim nec. Pellentesque vulputate, leo sit amet cursus aliquet, odio neque egestas eros, eget mattis sapien magna ut magna. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Quisque interdum dui a rutrum vehicula. Proin faucibus enim quam, at maximus neque ullamcorper ac. Pellentesque gravida leo ac tellus bibendum eleifend. Donec semper sodales sem nec euismod. Sed sed velit sed arcu porttitor eleifend. Aliquam erat volutpat.',
	'Nulla elit purus, molestie eget aliquet nec, volutpat id enim. Pellentesque vel dui lobortis, faucibus elit quis, pellentesque odio. Fusce feugiat porta neque. Nulla volutpat sollicitudin lorem eu scelerisque. Maecenas congue efficitur maximus. Praesent vehicula nisi et placerat hendrerit. Aenean sed egestas quam.',
	'Donec aliquet felis a hendrerit feugiat. Sed eu placerat dui. Nunc cursus nisi ut augue facilisis, efficitur scelerisque lorem tempus. Pellentesque nibh elit, pulvinar eget faucibus eu, ultrices ut diam. Nunc rutrum elit ut metus aliquam, quis tempus enim condimentum. Quisque vitae orci porta, vulputate metus ullamcorper, condimentum erat. Aenean bibendum lectus id elit suscipit, ac sollicitudin lacus pretium. Quisque laoreet, eros quis pellentesque mollis, felis orci porttitor ante, mattis hendrerit lectus tortor sed orci. Vivamus lacinia commodo sem vehicula tristique. Duis eget mauris et erat efficitur molestie vel eu odio. Praesent iaculis tincidunt nibh, quis auctor metus congue id. Nulla facilisi. Duis rutrum maximus sapien in tincidunt. Vivamus vehicula facilisis ligula, vel interdum orci vehicula sit amet. Nam metus sapien, rhoncus et elit non, commodo pretium turpis. Sed dapibus augue dui, eget sodales augue rhoncus vel.',
];

const makeArray = (length: number) => new Array(length).fill(0);

interface Props {
	count?: number;
}

const LoremIpsum: FC<Props> = ({count = 1}) => (
	<>
		{makeArray(count).map((_, index) => (
			<p key={index}>{textParagraphs[index % textParagraphs.length]}</p>
		))}
	</>
);

export default LoremIpsum;
