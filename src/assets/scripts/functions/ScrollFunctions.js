
export const scrollPercent = (container) => {
    return (scrollY - container.offsetTop) / container.getBoundingClientRect().height;
}