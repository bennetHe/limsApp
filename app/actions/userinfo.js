/**
 * Created by echoLC on 2017/7/25.
 */
import * as actionTypes from '../store/userinfo'

export function update(data) {
    return {
        type: actionTypes.USERINFO_UPDATE,
        data
    }
}
