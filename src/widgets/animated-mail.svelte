<script>
//https://codepen.io/solidpixel/pen/EvwOaq
import { onMount } from 'svelte';
import { TimelineLite, TweenMax, Back } from 'gsap';
import { gsap } from "gsap/all";
import { content } from '../content';

let line1;
let line2;
let line3;
let mailIcon;
let envLid;
let envPaper;
let toggleMail = false;

export let state;
const color = {
    success: content.de.messages.success.color,
    error: content.de.messages.error.color
};

onMount(() => {
    let tl = new TimelineLite({
        paused:true,
    });
    TweenMax.defaultEase = Back.easeOut;
    tl.to(
            envLid, 0.7, {
            scaleY:-1,
            y: 1.5,
            }
        )
        .fromTo(envPaper, 0.4, {
            transformOrigin: "50% 100%",
            scaleY: 0,
        },{
            scaleY: 1,
        }, "=-0.2")
        .staggerFromTo([line1, line2, line3], 0.3, {
            transformOrigin: "50% 50%",
            scaleX: 0
        },{
            scaleX: 1,
        },	-0.09)
        tl.play();
    });
</script>

<svg bind:this={mailIcon} class={toggleMail ? '' : 'toggled'} version="1.1" id="mail-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="96.3 -4.7 45.1 46.2" style="enable-background:new 96.3 -4.7 45.1 46.2;" xml:space="preserve">
<path class="st0" d="M138.2,10.5H99.5c-1.7,0-3.1,1.4-3.1,3.1v24.8c0,1.7,1.4,3.1,3.1,3.1h38.7c1.7,0,3.1-1.4,3.1-3.1V13.6
    C141.3,11.9,139.9,10.5,138.2,10.5z"/>
<path class="st0" d="M125.6,30.7c-3.7-2.6-6.6-4.6-6.8-4.7l0,0L125.6,30.7z"/>
<path bind:this={envLid} id="env-lid" class="st0" d="M118.9,26L118.9,26c0,0,16-11.1,21.4-14.8c-0.5-0.5-1.2-0.8-2-0.8H99.5c-0.8,0-1.5,0.3-2,0.8
	L118.9,26L118.9,26z" data-svg-origin="97.5 10.399999618530273" transform="matrix(1,0,0,1,0,0)"></path>
<path bind:this={envPaper} id="env-paper" class="st1" d="M135.8,34.2h-33.9c-1.3,0-2.4-1.1-2.4-2.4V0.7c0-1.3,1.1-2.4,2.4-2.4h33.9
    c1.3,0,2.4,1.1,2.4,2.4v31.1C138.1,33.1,137.1,34.2,135.8,34.2z"/>
<path bind:this={line1} id="env-line-3" class="st2" d="M131.2,6.5h-24.7c-0.9,0-1.6-0.7-1.6-1.6l0,0c0-0.9,0.7-1.6,1.6-1.6h24.6
    c0.9,0,1.6,0.7,1.6,1.6l0,0C132.8,5.7,132.1,6.5,131.2,6.5z"/>
<path bind:this={line2} id="env-line-2" class="st2" d="M131.2,14.1h-24.7c-0.9,0-1.6-0.7-1.6-1.6l0,0c0-0.9,0.7-1.6,1.6-1.6h24.6
    c0.9,0,1.6,0.7,1.6,1.6l0,0C132.8,13.4,132.1,14.1,131.2,14.1z"/>
<path bind:this={line3} id="env-line-1" class="st2" d="M131.2,21.5h-24.7c-0.9,0-1.6-0.7-1.6-1.6l0,0c0-0.9,0.7-1.6,1.6-1.6h24.6
    c0.9,0,1.6,0.7,1.6,1.6l0,0C132.8,20.8,132.1,21.5,131.2,21.5z"/>
<path class="st3" style="fill:{color[state]};" d="M97.6,11.1c-0.6,0.5-1.3,1.5-1.3,2.4v24.9c0,1.7,1.4,3.1,3.1,3.1h38.8c0.8,0,1.4-0.3,2-0.7
    C137.1,38.7,97.6,11.1,97.6,11.1z"/>
<path class="st4" d="M140.3,11.2c-5.4,3.7-21.4,14.8-21.4,14.8l0,0c0.2,0.1,18.2,12.7,21.3,14.8c0.7-0.6,1.2-1.4,1.2-2.3v-25
    C141.3,12.6,140.9,11.8,140.3,11.2z"/>
</svg>

<style>
.st0{fill:#CCCCCC;}
.st1{fill:#F5F5F5;}
.st2{fill:#1c1c1c;}
.st4{fill:#50df29;}

#mail-icon {
    border-radius: 15px;
	width: 90px;
	cursor: pointer;
}
</style>