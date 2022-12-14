import { FC, useEffect, useState } from "react"
import { IOrder } from "../../interfaces"
import st from "./OrderReminderModal.module.scss"
interface PropTypes{
    onClose: ()=>void
    order: IOrder
}

export const OrderReminderModal: FC<PropTypes>=({onClose, order}) => {
    const [disabledConfirm, setDisabledConfirm] = useState(true)
    const [blockingTime, setBlockingTime] = useState(10)
    let timer: string | number | NodeJS.Timeout | undefined
    let x = 15
    function countdown(){  // функция обратного отсчета
        x--
        setBlockingTime(x)
        if (x<=0){
            clearTimeout(timer);
            setDisabledConfirm(false)
        }
        else {
            timer = setTimeout(countdown, 1000);
        }
    }
    useEffect(()=>{
        countdown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div id={st["order-reminder-modal"]}>
            <div id={st["message"]}>
                <h3>Спасибо за заказ!</h3>
                <p>Сумма перевода: <b>{order.cost_of_delivery + order.cost_of_products} ₽</b></p>
                <p>Перевод по номеру телефона: <b>89197665190</b></p>
                <p>Андрей Алексеевич Ч.</p>
                <p>Сбербанк</p>
                <hr />
                <p><strong>!!!В поле комментарий ни чего не указывать!!!</strong></p>
                <hr />
                <p>Переведите указанную сумму на номер.</p>
                <p>Скриншот с доказательством перевода, отправьте в личные сообщения группы <a href="https://vk.com/darkvapor">https://vk.com/darkvapor</a>.</p>
                <p>Ожидайте подтверждения заказа.</p>
            </div>
            <div>
                <button id={st["confirmed"]} onClick={()=>{onClose(); window.location.replace("/")}} disabled={disabledConfirm}>Понял. Больше не показывать. {blockingTime !== 0 && <label>({blockingTime})</label>}</button>
            </div>
        </div>
    )
}