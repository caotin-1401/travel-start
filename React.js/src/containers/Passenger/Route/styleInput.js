export const customStyles = {
    control: () => ({
        border: "none",
        display: "flex",
        position: "relative",
        boxSizing: "border-box",
        flexWrap: "wrap",
        transition: "all 100ms",
        justifyContent: "space-between",
    }),
    valueContainer: () => ({
        width: 290,
        height: 27,
        alignItems: "center",
        flexWrap: "wrap",
        padding: "2px 10px",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        display: "grid",
    }),
    indicatorSeparator: () => ({
        display: "none",
    }),
    placeholder: () => ({
        display: "display",
    }),
};

export const customStylesBanner = {
    control: (base) => ({
        // ...base,
        border: "none",
        display: "flex",
        position: "relative",
        boxSizing: "border-box",
        flexWrap: "wrap",
        transition: "all 100ms",
        justifyContent: "space-between",
    }),
    valueContainer: (base) => ({
        // ...base,
        // width: 290,
        height: 27,
        alignItems: "center",
        flexWrap: "wrap",
        padding: "2px 10px",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        display: "grid",
    }),
    indicatorSeparator: (base) => ({
        ...base,
        display: "none",
    }),
};
