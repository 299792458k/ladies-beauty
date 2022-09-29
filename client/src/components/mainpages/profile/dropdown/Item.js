import './Item.css'
function Item({ children, handleClick, value, setValue }) {
    return (
        <div className="profile-popup-item" onClick={() => { handleClick(value, setValue); }} >
            {children}
        </div>
        //onClick={handleClick(value)}
    );
}

export default Item;