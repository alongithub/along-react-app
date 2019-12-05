const configUtil = {
    mapTable: (headMapKey) => {
        return (str, options = {}) => {
            let key = headMapKey[str];
            if (key === undefined) {
                console.log(`${str}:Table未定义映射`);
                key = `random${Math.random()}`;
            }
            return {
                title: str,
                dataIndex: key,
                key,
                ...options,
            };
        }
    },
    mapForm: (headMapKey) => {
        return (str, options = {}) => {
            let key = headMapKey[str];
            if (key === undefined) {
                console.log(`${str}:Form未定义映射`);
                key = `random${Math.random()}`;
            }
            return {
                label: str,
                field: key,
                ...options,
            };
        }
    },
};

export default configUtil;
