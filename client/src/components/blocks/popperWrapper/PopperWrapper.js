import './PopperWrapper.css'


function PopperWrapper({ children }) {
    return (
        <div className="wrapper">
            {children}
        </div>
    );
}

export default PopperWrapper;