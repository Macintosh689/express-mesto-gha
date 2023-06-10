const cardRouter = require('express').Router();
const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', deleteCardById);

cardRouter.post('/', createCard);

cardRouter.put('/:cardId/likes', likeCard);

cardRouter.delete('/:cardId/likes', dislikeCard);

module.exports = cardRouter;
