KISSY.use("event,gallery/switchable/1.3.1/,node", function (S, Event, Switchable) {
    var Slide = Switchable.Slide;
    S.ready(function (S) {
        Slide('#demo4', {
            navCls : 'yslider-stick',
            contentCls : 'yslider-stage',
            activeTriggerCls : 'selected',
            delay : .2,
            effect : 'fade',
            easing : 'easeBoth',
            duration : .8,
            autoplay : true
        });
    });
});
 