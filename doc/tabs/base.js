/**
 * Tabs Widget
 * @author lifesinger@gmail.com
 */
KISSY.add(function(S, Switchable) {
    function Tabs(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Tabs)) {
            return new Tabs(container, config);
        }

        Tabs.superclass.constructor.call(self, container, config);

        self.on('beforeSwitch',beforeSwitch);
        self.on('switch',afterSwitch);
    }


    function beforeSwitch(e){
        this.panels[e.toIndex].style.visibility='';
    }

    function afterSwitch(e){
        this.panels[e.fromIndex].style.visibility='hidden';
    }

    S.extend(Tabs, Switchable);

    Tabs.Config = {};

    return Tabs;
}, {
    requires:["../base"]
});
