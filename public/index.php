<?php

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=1");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$html = file_get_contents("index.html");
pushFutureFiles($html);


// demo data
/*
//header("Link: </app/react.min.js>; rel=preload; as=script, </app/react-dom.min.js>; rel=preload; as=script, </static/js/2.24204a8f.chunk.js>; rel=preload; as=script, </static/js/main.8237c89d.chunk.js>; rel=preload; as=script, </static/css/2.56aca66b.chunk.css>; rel=preload; as=style, </static/css/main.a121e212.chunk.css>; rel=preload; as=style, </apple-touch-icon.png>; rel=preload; as=image, </favicon-32x32.png>; rel=preload; as=image, </favicon-16x16.png>; rel=preload; as=image, </safari-pinned-tab.svg>; rel=preload; as=image, </wp-json/wp-api-menus/v2/menus/10>; rel=preload; as=blob", false);		
//header("Link: </app/react.min.js>; rel=preload; as=script; ", false);		
//header("Link: </static/js/2.24204a8f.chunk.js>; rel=preload; as=script", false);	

$headers = apache_request_headers();

foreach ($headers as $header => $value) {
    header("x-"."$header: $value", false);	
}
*/  
 
// Not sure why "as" is wrong. fetch also does not work
//header("Link: </wp-json/wp-api-menus/v2/menus/10>; rel=preload; as=script", false);		


echo $html;



function pushFutureFiles($html){
	preg_match_all('/"(\/[^>"]*.js)"[^;]/', $html, $urls);
	if($urls && $urls[1]) 
		forEach($urls[1] as $url) 
			header("Link: <$url>; rel=preload; as=script", false);		
  
    preg_match_all('/"(\/[^>"]*.css)"[^;]/', $html, $urls);
	if($urls && $urls[1]) 
		forEach($urls[1] as $url) 
			header("Link: <$url>; rel=preload; as=style", false);
// the images in link does not like to be pushed
/*
	preg_match_all('/"(\/[^>"]*.(?:png|jpe?g|gif|svg))"[^;]/', $html, $urls);
	if($urls && $urls[1]) 
		forEach($urls[1] as $url) 
			header("Link: <$url>; rel=preload; as=image", false);		
*/

}