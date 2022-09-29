import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function Stars({ stars }) {
    const starsArr = [1, 2, 3, 4, 5];
    return (
        starsArr.map(item => (
            <FontAwesomeIcon key={item} className="rating-icon" icon={stars >= item ? ["fas", "star"] : ["far", "star"]} />
        ))
    );
}

export default Stars;