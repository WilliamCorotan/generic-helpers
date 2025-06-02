
/**
 * Common 
 */
class ElementEventManager {
    constructor({
        selector,
        eventInit,
        eventDestroy,
        options = {
            root: null,
            rootMargin: "50px",
            threshold: 0.1,
        },
        initOnLoad = true,
    }) {
        this.selector = selector;
        this.eventInit = eventInit;
        this.eventDestroy = eventDestroy;
        this.options = options;
        this.initializedElements = new WeakSet();
        this.isObserving = false;

        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.options
        );

        if (initOnLoad) {
            this.observe();
        }
    }

    handleIntersection(entries) {

        for(const entry of entries) {
            const element = entry.target;

            if (
                entry.isIntersecting &&
                !this.initializedElements.has(element)
            ) {
                this.eventInit(element);
                this.initializedElements.add(element);
            } else if (
                !entry.isIntersecting &&
                this.initializedElements.has(element)
            ) {
                this.eventDestroy(element);
                this.initializedElements.delete(element);
            } 
        }

        // entries.forEach((entry) => {
        //     const element = entry.target;

        //     if (
        //         entry.isIntersecting &&
        //         !this.initializedElements.has(element)
        //     ) {
        //         this.eventInit(element);
        //         this.initializedElements.add(element);
        //     } else if (
        //         !entry.isIntersecting &&
        //         this.initializedElements.has(element)
        //     ) {
        //         this.eventDestroy(element);
        //         this.initializedElements.delete(element);
        //     }
        // });
    }

    observe() {
        if (this.isObserving) return;

        for(const element of document.querySelectorAll(this.selector)) {
            this.observer.observe(element);
        }
        // document.querySelectorAll(this.selector).forEach((element) => {
        //     this.observer.observe(element);
        // });

        this.isObserving = true;
    }

    disconnect() {
        if (!this.isObserving) return;

        this.observer.disconnect();

        for(const element of document.querySelectorAll(this.selector)) {
            if (this.initializedElements.has(element)) {
                this.eventDestroy(element);
                this.initializedElements.delete(element);
            }
        }

        // document.querySelectorAll(this.selector).forEach((element) => {
        //     if (this.initializedElements.has(element)) {
        //         this.eventDestroy(element);
        //         this.initializedElements.delete(element);
        //     }
        // });

        this.isObserving = false;
    }

    // Add new elements dynamically
    addElements(elements) {
        if (!this.isObserving) return;

        for(const element of elements) {
            if (element.matches(this.selector)) {
                this.observer.observe(element);
            }
        }

        // elements.forEach((element) => {
        //     if (element.matches(this.selector)) {
        //         this.observer.observe(element);
        //     }
        // });
    }

    // Remove specific elements
    removeElements(elements) {

        for(const element of elements) {
            if (this.initializedElements.has(element)) {
                this.eventDestroy(element);
                this.initializedElements.delete(element);
                this.observer.unobserve(element);
            }
        }

        // elements.forEach((element) => {
        //     if (this.initializedElements.has(element)) {
        //         this.eventDestroy(element);
        //         this.initializedElements.delete(element);
        //         this.observer.unobserve(element);
        //     }
        // });
    }

    // Update options
    updateOptions(newOptions) {
        this.disconnect();
        this.options = { ...this.options, ...newOptions };
        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.options
        );
        this.observe();
    }
}

// Usage examples:

// 1. For tooltips
// const tooltipManager = new ElementEventManager({
//     selector: '.tooltip-element',
//     eventInit: (element) => {
//         $(element).tooltip('enable');
//     },
//     eventDestroy: (element) => {
//         $(element).tooltip('destroy');
//     }
// });

// 2. For multiple different plugins
// const managers = {
//     tooltip: new ElementEventManager({
//         selector: '.tooltip-element',
//         eventInit: (element) => $(element).tooltip(),
//         eventDestroy: (element) => $(element).tooltip('destroy')
//     }),

//     datepicker: new ElementEventManager({
//         selector: '.datepicker-input',
//         eventInit: (element) => $(element).datepicker(),
//         eventDestroy: (element) => $(element).datepicker('destroy'),
//         options: { rootMargin: '100px' }
//     })
// };

// Handle dynamic content
// function handleNewContent(container) {
//     // Add new elements to existing managers
//     Object.values(managers).forEach(manager => {
//         manager.addElements(container.children);
//     });
// }

// Cleanup specific elements
// function removeElements(elements) {
//     Object.values(managers).forEach(manager => {
//         manager.removeElements(elements);
//     });
// }

// Update options for specific manager
// function updateScrollMargin(margin) {
//     managers.tooltip.updateOptions({ rootMargin: margin });
// }

// Cleanup all
// function cleanup() {
//     Object.values(managers).forEach(manager => manager.disconnect());
// }
