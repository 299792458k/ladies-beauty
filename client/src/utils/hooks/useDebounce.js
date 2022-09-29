import { useEffect, useState } from "react";

const useDebounce = (value, timeout = 500) => {
    // State and setters for debounced value
    const [debounceSearch, setDebounceSearch] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceSearch(value);
        }, timeout)
        return () => {
            clearTimeout(timer)
        }
    }, [timeout, value])
    return debounceSearch;
}
export default useDebounce;
