async function f() {
    return Promise.resolve(1);
}

f().then(alert);