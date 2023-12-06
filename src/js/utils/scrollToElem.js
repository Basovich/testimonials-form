/**
 * target - node elem. Item to scroll to
 * offset - number. Indentation from the element to which we scroll. A negative value is longer from to the block.
 * smooth - boolean, optional, default true. Slow or fast scrolling
 *
 * Example: scrollToElem('[data-claim-banner]', 0, false);
 * */

export const scrollToElem = (target, offset, smooth = true) => {
    if (!target) return;

    const options = {
        top: target.offsetTop + offset,
        behavior: smooth ? 'smooth' : 'auto',
    };

    return window.scrollTo(options);
};
