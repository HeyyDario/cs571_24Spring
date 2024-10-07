const Student = (props) => {
    return <div>
        <h2>{props.name.first} {props.name.last}</h2>
        {/* TODO Student data goes here! */}
        <p>Major: {props.major}</p>
            <p>Credits: {props.numCredits}</p>
            <p>From Wisconsin: {props.fromWisconsin ? 'Yes' : 'No'}</p>
            <h3>Interests</h3>
            <ul>
                {props.interests.map((interest, index) => (
                    <li key={index}>{interest}</li> // Using index as key since each interest is unique per person
                ))}
            </ul>
    </div>
}

export default Student;