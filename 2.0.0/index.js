/**
 * switchable
 */
KISSY.add(function (S, Switchable, Accordion, Carousel, Slide, Tabs) {
    var re = {
        Accordion: Accordion,
        Carousel: Carousel,
        Slide: Slide,
        Tabs: Tabs
    };
    
    S.mix(Switchable, re);

    return Switchable;
}, {
    requires: [
        "./base",
        "./accordion/base",
        "./carousel/base",
        "./slide/base",
        "./tabs/base",
        "./lazyload",
        "./effect",
        "./circular",
        "./carousel/aria",
        "./autoplay",
        "./aria",
        "./tabs/aria",
        "./accordion/aria"
    ]
});
