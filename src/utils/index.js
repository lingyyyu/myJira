export const isFalsy = (value) => value === 0 ? false : !value

//判断传入的对象是否有键值为空，为空则删除
export const cleanObject = (object) => {
    const result = { ...object }
    Object.keys(result).map((key) => {
        const value = result[key]
        if (isFalsy(value)) {
            delete result[key]
        }
    })
    return result
}