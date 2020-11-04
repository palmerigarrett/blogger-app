import React from 'react';

const { useState } = React;

const getItem = (key) => {
    document.cookie.split("; ").reduce((complete, current) => {
        const item = current.split("=");
        const currKey = item[0];
        const currValue = item[1];

        const isEqual = key === currKey;
        if (isEqual) {
            const returnVal = decodeURIComponent(currValue)
            return returnVal
        } else {
            return complete
        }
    }, '')
}

const setItem = (key, value, numberOfDays) => {
    const keySplit = key.split(" && ");
    const now = new Date();

    now.setTime(now.getTime() + (numberOfDays * 60 * 60 * 24 * 1000));

    document.cookie = `${key}=${value}; expires=${now.toUTCString()}; path=/`;
}

const useCookie = (key, defaultValue) => {
    const getCookie = () => (getItem(key) || defaultValue)
    const [cookie, setCookie] = useState(getCookie())

    const updateCookie = (value, numberOfDays) => {
        setCookie(value);
        setItem(key, value, numberOfDays);
    };

    return [cookie, updateCookie];
}

export default useCookie;