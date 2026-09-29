import { useAuth } from '../AuthContext'
import { CARD_BY_ID } from '../lib/cards'
import { useCardView } from '../lib/useCardView'

// One TWI pocket card, read-only. Opening it starts the view timer.
export default function CardView({ cardId }) {
  const { profile } = useAuth()
  const card = CARD_BY_ID[cardId]
  useCardView(cardId, !!profile && profile.active !== false)

  if (!card) return null

  return (
    <article className="twi-card" aria-labelledby={`${card.id}-title`}>
      <header className="twi-card__head">
        <span className="twi-card__code" aria-hidden="true">
          {card.short}
        </span>
        <div>
          <h1 id={`${card.id}-title`} className="twi-card__title">
            {card.title}
          </h1>
          <p className="twi-card__subtitle">{card.subtitle}</p>
        </div>
      </header>

      <div className="twi-card__body">
        {card.intro && <p className="twi-card__intro">{card.intro}</p>}

        {card.before && (
          <section className="twi-card__before">
            <h2 className="twi-card__section">{card.before.heading}</h2>
            <ul className="twi-card__list">
              {card.before.items.map((item) => (
                <li key={item.title}>
                  <b>{item.title}.</b> {item.text}
                </li>
              ))}
            </ul>
            {card.before.footer && <p className="twi-card__note">{card.before.footer}</p>}
          </section>
        )}

        <section>
          <h2 className="twi-card__section">{card.stepsHeading}</h2>
          {card.stepsIntro && <p className="twi-card__note">{card.stepsIntro}</p>}
          <ol className="twi-steps">
            {card.steps.map((step, i) => (
              <li key={step.title} className="twi-step">
                <span className="twi-step__num" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <h3 className="twi-step__title">
                    <span className="visually-hidden">Step {i + 1}: </span>
                    {step.title}
                  </h3>
                  <ul className="twi-step__points">
                    {step.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {card.closing && <p className="twi-card__closing">{card.closing}</p>}
      </div>
    </article>
  )
}
