import { Button, Container, Form, Pagination, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";
import Student from "./Student";

const Classroom = () => {

    const[students, setStudents] = useState([]); // orig dataset
    const [nameSearch, setNameSearch] = useState(''); // name query
    const [majorSearch, setMajorSearch] = useState(''); // major query
    const [interestSearch, setInterestSearch] = useState(''); //interest query
    const [shownStudents, setShownStudents] = useState([]); // students based on queries
    const [page,setPage] = useState(1); // page number in pagination unit
    const ITEM_PER_PAGE = 24;


    useEffect(() => {
        fetch("https://cs571.org/api/s24/hw4/students", {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        })
        .then(res => res.json())
        .then(data => {
            setStudents(data);
            console.log(data);
        })
    }, [])
    
    //search functionality
    useEffect(() => {
        const filterStudents = () => {
            return students.filter((student) => {
                const name = `${student.name.first} ${student.name.last}`.toLowerCase();
                // const matchesName = nameSearch.trim() ? name.includes(nameSearch.trim().toLowerCase()) : true;
                // const matchesMajor = majorSearch.trim() ? student.major.toLowerCase().includes(majorSearch.trim().toLowerCase()) : true;
                // const matchesInterest = interestSearch.trim() ? student.interests.some(interest => interest.toLowerCase().includes(interestSearch.trim().toLowerCase())) : true;

                // return matchesName && matchesMajor && matchesInterest;
                const major = `${student.major}`.toLowerCase();
                const interests = student.interests.map(interest => interest.toLowerCase());
                //console.log(interests);
                return (!nameSearch||name.includes(nameSearch.trim().toLowerCase())) 
                && (!majorSearch || major.includes(majorSearch.trim().toLowerCase())) 
                && (!interestSearch || interests.some(interest => interest.includes(interestSearch.trim().toLowerCase())));
            });
        };

        setShownStudents(filterStudents()); // better version
    }, [nameSearch, majorSearch, interestSearch, students]);

    const resetSearch = () => {
        setNameSearch('');
        setMajorSearch('');
        setInterestSearch('');
        setShownStudents(students);
        setPage(1);
    };

    function pagi(){// get recommendation from Hongtao Hao and https://react-bootstrap.netlify.app/docs/components/pagination/ 
        
        let items = [];
        let pageCount = Math.ceil(shownStudents.length / ITEM_PER_PAGE);
        //console.log(pageCount);
        items.push(<Button key="prev" onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>);
        for (let index = 1; index <= pageCount; index++) {
            items.push(
                <Pagination.Item key={index} active={page === index} onClick={() => setPage(index)}>{index}</Pagination.Item>
            );
        }
        items.push(<Button key="next" onClick={() => setPage(page + 1)} disabled={page === pageCount || pageCount === 0}>Next</Button>);
        return <div>
            <Pagination key="pageNum">{items}</Pagination>
            </div>;
    }

    return <div>
        <h1>Badger Book</h1>
        <p>Search for students below!</p>
        <hr />
        <Form>
            <Form.Label htmlFor="searchName">Name</Form.Label>
            <Form.Control id="searchName" value={nameSearch} onChange={(e) => setNameSearch(e.target.value)}/>
            <Form.Label htmlFor="searchMajor">Major</Form.Label>
            <Form.Control id="searchMajor" value={majorSearch} onChange={(e) => setMajorSearch(e.target.value)}/>
            <Form.Label htmlFor="searchInterest">Interest</Form.Label>
            <Form.Control id="searchInterest" value={interestSearch} onChange={(e) => setInterestSearch(e.target.value)}/>
            <br />
            <Button variant="neutral" onClick={resetSearch}>Reset Search</Button>
            <p>There are {shownStudents.length} student(s) matching your search.</p>
        </Form>
        <Container fluid>
            <Row>
            {/* TODO Students go here! */ 
            shownStudents.slice((page - 1) * ITEM_PER_PAGE, page * ITEM_PER_PAGE)
            .map((student) => (
                <Col xs={12} sm={12} md={6} lg={4} xl={3} key={student.id}>
                    <Student {... student} />
                </Col>
            ))}
            </Row>
        </Container>
        {pagi()}
    </div>

}

export default Classroom;