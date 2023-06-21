const cardRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards, deleteCardById, createCard, likeCard, dislikeCard
} = require('../controllers/cards');
const { REGEX } = require('../middlewares/validation');

cardRouter.get('/', getCards);

cardRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  })
}), deleteCardById);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(REGEX),
  })
}), createCard);

cardRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  })
}), likeCard);

cardRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  })
}), dislikeCard);

cardRouter.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = cardRouter;
