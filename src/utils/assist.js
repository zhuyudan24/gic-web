
export function findAnyComponent(context, componentName, root = null) {
    if (!root) {
        root = context.$root;
    }
    console.log(root);

    const childrens = root.$children;
    let children = null;

    if (childrens.length) {
        for (const child of childrens) {
            const name = child.$options.name;
            if (name === componentName) {
                children = child;
                break;
            } else {
                children = findAnyComponent(context, componentName, child);
                console.log(children);
                if (children) {
                    break;
                }
            }
        }
    }
    return children;
}

