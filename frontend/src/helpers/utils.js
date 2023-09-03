export const iterateOverData = async (countFn, dataFn) => {
    const count = await countFn();
    const data = [];
    for (let i = 0; i < count; i++) {
        const item = await dataFn(i);
        data.push(item);
    }
    return data;
};