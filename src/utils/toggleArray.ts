export const toggleArray = (array: unknown[], item: unknown) => {
    if (!array.includes(item)) {
        array.push(item);
    } else {
        const index = array.findIndex((r) => r === item);
        array.splice(index, 1);
    }
};

export const toggleArrayMixin = {
    methods: {
        toggleArray,
    },
};
