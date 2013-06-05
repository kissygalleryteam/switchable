/**
 * Switchable Lazyload Plugin
 */
KISSY.add(function (S, DOM, Switchable) {

    var EVENT_BEFORE_SWITCH = 'beforeSwitch',
        IMG_SRC = 'img',
        AREA_DATA = 'textarea',
        IMG_SRC_DATA = 'data-ks-lazyload',
        AREA_DATA_CLS = 'ks-datalazyload',
        CUSTOM = '-custom',
        FLAGS = {};

    FLAGS[IMG_SRC] = 'lazyImgAttribute';
    FLAGS[AREA_DATA] = 'lazyTextareaClass';

    /**
     * 添加默认配置
     */
    S.mix(Switchable.Config, {
        lazyImgAttribute: "data-ks-lazyload-custom",
        lazyTextareaClass: "ks-datalazyload-custom",
        lazyDataType: AREA_DATA // or IMG_SRC
    });

    /**
     * 加载图片 src
     * @static
     */
    function loadImgSrc(img, flag) {
        flag = flag || IMG_SRC_DATA;
        var dataSrc = img.getAttribute(flag);

        if (dataSrc && img.src != dataSrc) {
            img.src = dataSrc;
            img.removeAttribute(flag);
        }
    }

    function loadCustomLazyData(containers, type, flag) {
        var imgs;

        if (type === 'img-src') {
            type = 'img';
        }

        // 支持数组
        if (!S.isArray(containers)) {
            containers = [DOM.get(containers)];
        }

        // 遍历处理
        S.each(containers, function (container) {
            switch (type) {
                case 'img':
                    if (container.nodeName === 'IMG') { // 本身就是图片
                        imgs = [container];
                    } else {
                        imgs = DOM.query('img', container);
                    }

                    S.each(imgs, function (img) {
                        loadImgSrc(img, flag || (IMG_SRC_DATA + CUSTOM));
                    });
                    break;

                default:
                    DOM.query('textarea', container).each(function (area) {
                        if (DOM.hasClass(area, flag || (AREA_DATA_CLS + CUSTOM))) {
                            loadAreaData(area, true);
                        }
                    });
            }
        });
    }

    /**
     * 从 textarea 中加载数据
     * @static
     */
    function loadAreaData(area, execScript) {
        // 采用隐藏 textarea 但不去除方式，去除会引发 Chrome 下错乱
        area.style.display = 'none';
        area.className = ''; // clear hook
        var content = DOM.create('<div>');
        // area 直接是 container 的儿子
        area.parentNode.insertBefore(content, area);
        DOM.html(content, area.value, execScript);
    }


    /**
     * 织入初始化函数
     */
    Switchable.addPlugin({

        name: 'lazyload',

        init: function (host) {
            var cfg = host.config,
                type = cfg.lazyDataType,
                flag;

            if (type === 'img-src') {
                type = IMG_SRC;
            }
            else if (type === 'area-data') {
                type = AREA_DATA;
            }

            cfg.lazyDataType = type;
            flag = cfg[FLAGS[type]];
            // 没有延迟项
            if (!type || !flag) {
                return;
            }

            host.on(EVENT_BEFORE_SWITCH, loadLazyData);

            // 初始 lazyload activeIndex
            loadLazyData({
                toIndex: host.activeIndex
            });

            /**
             * 加载延迟数据
             */
            function loadLazyData(ev) {
                // consider steps == 1
                var steps = host._realStep || cfg.steps,
                    from = ev.toIndex * steps ,
                    to = from + steps;
                loadCustomLazyData(host.panels.slice(from, to), type, flag);
                if (isAllDone()) {
                    host.detach(EVENT_BEFORE_SWITCH, loadLazyData);
                }
            }

            /**
             * 是否都已加载完成
             */
            function isAllDone() {
                var elems,
                    i,
                    el,
                    len,
                    isImgSrc = type === IMG_SRC,
                    tagName = isImgSrc ? 'img' : (type === AREA_DATA ?
                        'textarea' : '');

                if (tagName) {
                    elems = DOM.query(tagName, host.container);
                    for (i = 0, len = elems.length; i < len; i++) {
                        el = elems[i];
                        if (isImgSrc ?
                            DOM.attr(el, flag) :
                            DOM.hasClass(el, flag)) {
                            return false;
                        }
                    }
                }
                return true;
            }
        }
    });

    return Switchable;

}, { requires: ["dom", "./base"]});
/**
 * 2012-10-17 yiminghe@gmail.com
 *  - 初始 lazyload activeIndex
 *  - consider steps == 1 for carousel
 *
 * yiminghe@gmail.com：2011.06.02 review switchable
 */
