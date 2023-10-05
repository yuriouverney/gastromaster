const ReservationStatus = require('../models/enums/reservation-status.enum');
const Reservation = require('../models/reservation.model');
const User = require('../models/user.model');
const BaseCrudService = require('./base-crud.service');
const moment = require('moment');
const EmailService = require('../utils/send-email');
const SettingService = require('./setting.service');

class ReservationService extends BaseCrudService {
  constructor() {
    super(Reservation);
  }

  async getAllReservations() {
    return await this.model.findAll({
      include: [{ model: User, attributes: { exclude: ['password'] } }],
      order: [['id', 'DESC']],
    });
  }

  async validateCreation(form) {
    const hasOtherReservationWithSameDate = await this.model.findOne({
      where: { user_id: form.user_id, date: form.date },
    });
    if (hasOtherReservationWithSameDate) throw new Error('Você ja tem uma reserva para esta data');
  }

  async createReservation(form, userId) {
    form.user_id = userId;
    await this.validateCreation(form);
    form.status = ReservationStatus.PENDING;
    const email = form.email;
    const date = moment(form.date).format('DD/MM/YYYY');
    const setting = await SettingService.getSettings();
    const subject = `${setting.name} - Reserva Cadastrada`;
    const emailSender = setting.email;
    const status =
      'o status atual da solicitação é AGUARDANDO APROVAÇÃO DO RESTAURANTE, você será notificado assim que a reserva for confirmada';
    const bodyMsg = `Nova reserva para o dia ${date}, ${status}`;
    const emailService = new EmailService();
    await emailService.init();
    emailService.sendEmail(emailSender, email, subject, bodyMsg);

    const reservation = await this.model.create(form);
    return reservation;
  }

  async getReservationByIdAdmin(id) {
    return await this.model.findOne({
      where: { id },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });
  }

  async getReservationById(reservationId, userId) {
    const reservation = await this.model.findOne({
      where: { id: reservationId },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });

    if (!reservation) throw new Error('Reserva não encontrada');
    if (reservation.user_id !== userId)
      throw new Error('Você não tem permissão para acessar esta reserva');
    return reservation;
  }

  async updateReservationAdmin(id, form) {
    const reservation = await this.model.findOne({ where: { id } });
    if (!reservation) throw new Error('Reserva não encontrada');
    let date = moment(reservation.date).format('DD/MM/YYYY');
    if (reservation.date != form.date) {
      date = form.date;
      date = moment(date).format('DD/MM/YYYY');
    }
    if (reservation.status != form.status) {
      let status;
      if (form.status == ReservationStatus.APPROVED) status = 'RESERVA APROVADA';
      if (form.status == ReservationStatus.CANCELED) status = 'RESERVA CANCELADA';
      const bodyMsg = `Houve uma mudança no status da sua reserva para o dia ${date}, ${status}`;
      const emailService = new EmailService();
      const setting = await SettingService.getSettings();
      const subject = `${setting.name} - Alteração no status da reserva`;
      const emailSender = setting.email;
      await emailService.init();
      const user = await User.findOne({ where: { id: reservation.user_id } });
      emailService.sendEmail(emailSender, user.email, subject, bodyMsg);
    }
    await reservation.update(form);
    return reservation;
  }

  async getAllReservationsByUser(id) {
    return await this.model.findAll({
      where: { user_id: id },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
      order: [['id', 'DESC']],
    });
  }

  async deleteReservationAdmin(id) {
    const reservation = await this.model.findOne({ where: { id: id } });
    if (!reservation) throw new Error('Reserva não encontrada');
    await reservation.destroy();
    return reservation;
  }

  async deleteReservation(id, userId) {
    const reservation = await this.model.findOne({ where: { id: id } });
    if (!reservation) throw new Error('Reserva não encontrada');
    if (reservation.user_id != userId)
      throw new Error('Você não tem permissão para excluir esta reserva');
    if (reservation.status != ReservationStatus.PENDING)
      throw new Error('Você não pode excluir uma reserva que já foi aprovada ou cancelada');
    await reservation.destroy();
    return reservation;
  }
}
module.exports = new ReservationService();
