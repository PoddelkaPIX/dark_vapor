import axios from "axios";
import { FC, useEffect, useReducer, useState } from "react";
import st from "./MakingOrderModal.module.scss"
import config from "../../config.json"
import { IBasket, IDeliverypoint, IOrder} from "../../interfaces";
import { SdekOrderForm } from "../../components/forms/SdekOrderForm/SdekOrderForm";
import { DaDataAddress, DaDataSuggestion } from "react-dadata";

interface PropTypes{
    onClose: ()=>void
    basket: IBasket
    setOrderReminder: (bool: boolean)=>void
    order: IOrder
    setOrder: (order:IOrder)=>void
}

export const MakingOrderModal: FC<PropTypes> = ({onClose, basket, setOrderReminder, order, setOrder})=>{
    const [disabledComplite, setDisabledComplite] = useState(true)

    const [deliverypoints, setDeliverypoints] = useState<IDeliverypoint[]>([])
    const [locationData, setLocalityData] = useState<DaDataSuggestion<DaDataAddress>>();

    const [update , forceUpdate] = useReducer(x => x + 1, 0);

    let weight = 0
    for (let i=0; i < Math.ceil(basket.products.length / 4); i++){
        weight += 500
    }
    order.weight = weight
    order.cost_of_products = basket.total_amount
    order.products = basket.products
    setOrder(order)

    
    function ValidPhone(telephone: string) {
        // eslint-disable-next-line no-useless-escape
        var re = /^[\d\+][\d\(\)\ -]{4,14}\d$/;
        var valid = re.test(telephone);
    
        return valid
    }  

    function handlerSetOrder(newOrder: IOrder){
        forceUpdate()
        setOrder(newOrder)

    }
    
    function complite(){
        let url = config.backend + "/addOrderSdek"
        axios({
            method: 'post',
            url: url,
            data: order,
            headers: { "Content-Type": "application/json" }
        }).then((response: any) => {
            if (!response.data.error){
                setOrderReminder(true)
                onClose()
            }else{
                alert(response.data.error)
            }
            
        }).catch((error) => {
            alert("??????????-???? ????????????????. ???????????????????? ???? ?????????????? ?? ???????? ???????????? https://vk.com/darkvapor. "+error)
        });
    }

    useEffect(()=>{
        console.log(order);
        
        if ( locationData !== undefined && locationData.data.city_with_type !== null){
            if (locationData.data.city_with_type !== null && locationData.data.city_with_type !== ""){
                order.location = locationData.data.city_with_type
            }
            order.country = locationData.data.country
            order.country_code = locationData.data.country_iso_code
            order.region = locationData.data.region_with_type
            
            setOrder(order)
        }
        if (ValidPhone(order.telephone) && order.cost_of_delivery !== 0 && order.last_name !== "" &&  
            order.first_name !== "" &&  order.patronymic !== "" &&  order.telephone !== ""  &&  
            order.location !== "" &&  order.delivery_point_code !== "" &&  order.feedback_URL !== "" &&
            order.country !== "" && order.region !== ""){
            setDisabledComplite(false) 
        }else{
            setDisabledComplite(true)
        }
    }, [locationData, setOrder, update])
    return (
        <div id={st["making-order-modal"]} >
            <div id={st["order-information"]}>
            <h2><strong>???????????????????? ?? ??????????????</strong></h2>
                <table id={st["products-table"]}>
                    <thead><tr><td>????????????????</td><td>????????</td><td>??????-????</td><td>??????????.</td></tr></thead>
                    <tbody>
                        {basket.products?.map((product, index)=><tr key={index}>
                            <td>{product.title_product}</td><td>{product.price} ???</td><td>{product.count} ????.</td>
                            <td>
                                {product.parameters?.map((parameter, index)=>
                                <div key={index} className={st["parameter"]}>
                                    <div>{parameter.title_parameter}</div>
                                    {parameter?.values.map((value, index)=><div key={index}>| <strong>{value}</strong> |</div>)}
                                </div>)}
                            </td>
                        </tr>)}
                    </tbody>
                </table>
                <div id={st["total-amount"]} ><b>?????????? ??????????????????: </b>{order.cost_of_products} + {order.cost_of_delivery} = <strong>{order.cost_of_delivery + order.cost_of_products} ???</strong></div>
            </div>
            <div id={st["making-order"]}>
                <div id={st["making-order-forma"]}>
                    <h2><strong>???????????????????? ????????????</strong></h2>
                    <label>??????????????  <input type="text" onChange={(e)=>{order.last_name = e.target.value ; setOrder(order); forceUpdate()}} placeholder="??????????????"/></label> 
                    <label>?????? <input type="text" onChange={(e)=>{order.first_name = e.target.value ; setOrder(order); forceUpdate()}} placeholder="??????"/></label> 
                    <label>???????????????? <input type="text" onChange={(e)=>{order.patronymic = e.target.value ; setOrder(order); forceUpdate()}} placeholder="????????????????"/></label> 
                    <label>?????????? ???????????????? <input type="tel" onChange={(e)=>{order.telephone = e.target.value ; setOrder(order); forceUpdate()}} placeholder="?????????? ????????????????"/></label> 
                    <label>VK ?????? TELEGRAM <input type="text" onChange={(e)=>{order.feedback_URL = e.target.value ; setOrder(order); forceUpdate()}} placeholder="VK ?????? TELEGRAM"/></label> 
                    <label>?????????????????? <br/>(???? ??????????????????????)<textarea onChange={(e)=>{order.message = e.target.value ; setOrder(order); forceUpdate()}} maxLength={1255}></textarea></label> 
                </div>
                <div id={st["choice-of-delivery"]}>
                    <h2><strong>???????????? ????????????????</strong></h2>
                    <select id={st["delivery-select"]} value={order.delivery} onChange={(e)=>{order.delivery = e.target.value; setOrder(order); forceUpdate()}}>
                        <option value="????????">????????</option>
                        {/* <option value="?????????? ????????????">?????????? ????????????</option> */}
                    </select>
                    {order.delivery === "????????" && 
                        <SdekOrderForm order={order} setOrder={handlerSetOrder} setLocalityData={(data)=>setLocalityData(data)} locationData={locationData} modalForceUpdate={forceUpdate} deliverypoints={deliverypoints} setDeliverypoints={(delivery_points: IDeliverypoint[])=>setDeliverypoints(delivery_points)}/>
                    }
                    {/* {order.delivery === "?????????? ????????????" && 
                        <PochtaOrderForm order={order} setOrder={handlerSetOrder} setLocalityData={(data)=>setLocalityData(data)} locationData={locationData} modalForceUpdate={forceUpdate} deliverypoints={deliverypoints} setDeliverypoints={(delivery_points: IDeliverypoint[])=>setDeliverypoints(delivery_points)}/>
                    } */}
                    {(order.cost_of_delivery !== undefined || order.cost_of_delivery !== 0) && <div id={st["delivery-amount"]} ><b>?????????????????? ????????????????: </b> {order.cost_of_delivery} ???</div>}
                </div>
                <button onClick={complite} disabled={disabledComplite} id={st["confirm-button"]}>?????????????????????? ?????????? ???? {order.cost_of_products + order.cost_of_delivery} ???</button>
            </div>
        </div>
    )
}