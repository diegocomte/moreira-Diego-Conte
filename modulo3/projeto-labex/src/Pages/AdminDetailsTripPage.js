import useRequestData from '../Hooks/UseRequestData';
import axios from 'axios';
import LogoWhite from '../Assets/LogoWhite.png';
import React from 'react';
import { Button } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";
import { useProtectedPage } from '../Hooks/useProtectedPage';
import { goToHomePage, goBack } from '../Route/NavFunctions';
import { BASE_URL } from '../Constants/BASE_URL';
import { userPathVariables } from '../Constants/UserPathVariables';
import {
  MainContainer,
  HomeButtonContainer,
  CardTrip,
  TripDetails,
  CandidatesContainer,
  CandidatesRequestContainer,
  ApprovedCandidatesContainer,
} from '../Components/StyleAdminTripsDetailsPage';


//________________________________________________________________________________________________

export default function AdminDetailsTripPage() {
  useProtectedPage()
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [tripData, error] = useRequestData(`${BASE_URL}${userPathVariables}trip/${id}`, { headers: { auth: token } });

  const logout = (navigate) => {
    localStorage.removeItem("token")
    goToHomePage(navigate)
  }

  const decideCandidate = (idcandidate, name, decision) => {
    axios.put(`${BASE_URL}${userPathVariables}trips/${id}/candidates/${idcandidate}/decide`, { approve: decision }, { headers: { auth: token } })
      .then((res) => {
        if (decision === true) {
          alert(`${name} constará na lista de viajantes`)
        } else {
          alert(`${name} não constará na lista de viajantes`)
        }
        window.location.reload()
      })
      .catch((err) => {
        alert(err)
      })
  }

  const candidates = tripData && tripData.trip.candidates.length > 0 ?
    tripData.trip.candidates.map((inscription) => {
      return (
        <ul key={inscription.id}>
          <li><b>Nome</b>: {inscription.name}</li>
          <li><b>Profissão</b>: {inscription.profession}</li>
          <li><b>Idade</b>: {inscription.age}</li>
          <li><b>País</b>: {inscription.country}</li>
          <li><b>Texto de candidatura</b>: {inscription.applicationText}</li>
          <Button
            variant="outlined"
            color='secondary'
            onClick={() => decideCandidate(inscription.id, inscription.name, true)}>
            Aprovar
          </Button>
          <Button
            variant="outlined"
            color='secondary'
            onClick={() => decideCandidate(inscription.id, inscription.name, false)}>
            Reprovar
          </Button>
          <hr></hr>
        </ul>
      )
    })
    :
    <p>sem candidatos</p>

  const approvedCandidates = tripData && tripData.trip.approved.length > 0 ?
    tripData.trip.approved.map((candidate) => {
      return (
        <ul key={candidate.id}>
          <li> {candidate.name}</li>
        </ul>
      )
    })
    :
    <p> Sem candidatos</p>

  return (
    <MainContainer>
      <HomeButtonContainer>
        <img
          onClick={() => goToHomePage(navigate)}
          src={LogoWhite}
          alt='Logo LabeX' />
        <Button
          variant="outlined"
          color='secondary'
          onClick={() => logout(navigate)}>
          Sair
        </Button>
      </HomeButtonContainer>
      <TripDetails>
        {tripData &&
          <CardTrip>
            <p>Viagem <b>{tripData.trip.name}</b></p>
            <li><b>Descrição</b>: {tripData.trip.description}</li>
            <li><b>Planeta</b>: {tripData.trip.planet}</li>
            <li><b>Duração em dias</b>: {tripData.trip.durationInDays}</li>
            <li><b>Data</b>: {tripData.trip.date}</li>
          </CardTrip>
        }
      </TripDetails>
      <CandidatesContainer>
        <CandidatesRequestContainer>
          <p> Candidatos pendentes</p>
          {candidates}
        </CandidatesRequestContainer>
        <ApprovedCandidatesContainer>
          <p>Cadidatos aprovados</p>
          {approvedCandidates}
        </ApprovedCandidatesContainer>
      </CandidatesContainer>
    </MainContainer>
  )
}