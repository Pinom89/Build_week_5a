import { Col, Container, Row, Spinner, Alert, Card, ListGroup } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import ModalExperience from './ModalExperience';
import AddExperience from '../AddExperience';
import UpdateExperience from '../UpdateExperience';
import DeleteExperience from '../DeleteExperience';
import fetchWithAuth from '../../services/fetchWithAuth';
import { AuthContext } from '../../Context/AuthContext';

function Experiences({ profile }) {
  const { authorLogin, isLoggedIn } = useContext(AuthContext);
  const [experiences, setExperiences] = useState([]);
  const [isEnableSpinner, setIsEnableSpinner] = useState(false);
  const [isError, setIsError] = useState(false);
  const params = useParams();

  // Use the ID from props or URL parameters
  const idToUse = authorLogin._id || params._id;

  console.log(idToUse);
  const API = import.meta.env.API_VITE ||"http://localhost:5000";
  const urlExperiences = '/profile';

  const fetchExperiences = async () => {
    setIsEnableSpinner(true);
    try {
      if (profile && profile._id) {
        const data = await fetchWithAuth(`${API}${urlExperiences}/${profile._id}/experiences`);
        setExperiences(data);
      }
      setIsError(false);
    } catch (error) {
      console.error('Error loading...', error);
      setIsError(true);
    } finally {
      setIsEnableSpinner(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [profile]);



  return (
    <Container className='content__analisi content__info__profile p-4'>
      <Row className='user__detail'>
        <Col>
          <div className='d-flex align-items-center justify-content-between'>
            <h5 className='name mb-0'>Esperienze</h5>
            {profile._id === authorLogin._id && (
              <div className='mx-3'>
                <AddExperience authorLogin={authorLogin} fetchExperiences={fetchExperiences} />
              </div>
            )}
          </div>
          <Container>
            <Row>
              <Col>
                {isEnableSpinner && <div className='text-center mt-5'><Spinner animation='grow' /></div>}
                {isError && <div className='text-center mt-5'><Alert variant='danger'>Error loading...</Alert></div>}
                {experiences.length > 0 ? (
                  experiences.map((experience) => (
                    <div key={experience._id}>
                      <Card className='p-0 mt-2'>
                        <Card.Header className='text-bold'>{experience.company}</Card.Header>
                        <Card.Body>
                          <Card.Title className='text-bold'>{experience.role}</Card.Title>
                          <div className='d-flex gap-2 justify-content-start align-items-center'>
                            <ListGroup.Item 
                              style={{border:'solid 1px #ccc', padding:'10px', borderRadius:'10px'}} 
                            >
                              Data inizio: {format(new Date(experience.startDate), 'dd/MM/yyyy')}
                            </ListGroup.Item>
                            <ListGroup.Item 
                              style={{border:'solid 1px #ccc', padding:'10px', borderRadius:'10px'}}
                            >
                              {experience.endDate ? 'Data Fine: ' + format(new Date(experience.endDate), 'dd/MM/yyyy') : 'Ancora in corso'} 
                            </ListGroup.Item>
                          </div>
                          <div className="card-footer mt-2">
                            <ModalExperience experience={experience} />
                            {profile._id === authorLogin._id && (
                              <>
                                <UpdateExperience authorLogin={authorLogin} experience={experience} fetchExperiences={fetchExperiences} />
                                <DeleteExperience authorLogin={authorLogin} experience={experience} fetchExperiences={fetchExperiences} />
                              </>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))
                ) : (
                  <p>Non hai ancora pubblicato nulla</p>
                )}
              </Col>
            </Row>
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default Experiences;

