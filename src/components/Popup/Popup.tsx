import React, { FunctionComponent } from 'react';
import style from './Popup.module.scss';
import { Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import Button from '../Button';
import { distancePipe, durationPipe } from '../../utils/pipes';

interface IRide {
  id: number;
  pickUpAddress: string;
  dropOffAddress: string;
  price: number;
  distance: number;
  duration: number;
  passenger: {
    fullName: string;
    profilePhoto: string;
  }
}

interface IProps {
  ride: IRide;
  open: boolean;
  onAcceptRide: any;
}

const Popup: FunctionComponent<IProps> = ({ ride: nearbyRide, open = false, onAcceptRide }) => {
  return (
    <Dialog aria-labelledby="customized-dialog-title" fullWidth open={open}>
      <DialogTitle className={style.DialogTitle}>
        New request a Ride
      </DialogTitle>
      <DialogContent dividers className={style.DialogContent}>
        <div>
          <h4>Pick Up Address</h4>
          <span>{ nearbyRide.pickUpAddress }</span>
        </div>
        <div>
          <h4>Drop Off Address</h4>
          <span>{ nearbyRide.dropOffAddress }</span>
        </div>
        <div>
          <h4>Price</h4>
          <span>{ nearbyRide.price }</span>
        </div>
        <div>
          <h4>Distance</h4>
          <span>{ distancePipe(nearbyRide.distance) }</span>
        </div>
        <div>
          <h4>Duration</h4>
          <span>{ durationPipe(nearbyRide.duration) }</span>
        </div>
        <div>
          <h4>Passenger</h4>
          <div className={style.Passenger}>
            <Avatar alt="Remy Sharp" src={nearbyRide.passenger.profilePhoto} className={style.Avatar} />
            <span>{ nearbyRide.passenger.fullName }</span>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button label="Accept Ride" onClick={(event) => onAcceptRide(event, nearbyRide.id)} />
      </DialogActions>
    </Dialog>
  )
};

export default Popup;
