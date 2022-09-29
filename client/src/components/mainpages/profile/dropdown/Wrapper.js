import './Wrapper.css'
function Wrapper({children, width}) {
    return (
        <div className="profile-popup-wrapper" style={{width: width}} >
            {children}
        </div>
    );
}

export default Wrapper;