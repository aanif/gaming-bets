<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Model\User;
use App\Model\Card;
use Illuminate\Support\Facades\Auth;

class CardController extends Controller
{
    //

    /**
     * @OA\Post(
     *     path="/api/card/add-payment-method/{id}",
     *     tags={"card"},
     * @OA\Parameter(
     *     name="id",
     *     in="path",
     *     description="User ID of Customer",
     *     required=true,
     * ),
     * @OA\Parameter(
     *     name="token",
     *     in="query",
     *     description="Card Token generated by Stripe Card Element",
     *     required=true,
     * ),
     * @OA\Parameter(
     *     name="name",
     *     in="query",
     *     description="Card holder name",
     * ),
     *     @OA\Response(response="200", description="Attach Card to User"),
     * security={
     *         {"query_token": {}}
     *     }
     * )
     */
    public function attachPaymentMethod(request $request, $id)
    {
        $this->validate(
            $request->all(),
            [
                'token' => ['required'],
                'name' => ['required'],
            ]
        );
        $user = Auth::user();
        $id = $user->id;
        if (!User::find($id)) {
            return response()->json(['error' => 'User does not exist.'], 400);
        }
        $stripe_id = User::getUserStripeId($id);

        $paymentMethod = Card::createPaymentMethod($request->token);
        if ($paymentMethod['error']) {
            return response()->json(
                [
                    'message' => $paymentMethod['error']
                ],
                400
            );
        }
        $ret = Card::attachPaymentMethod($paymentMethod, $stripe_id);
        if ($ret) {
            return response()->json(
                [
                    'message' => $ret,
                ],
                400
            );
        }

        $existingCard = Card::getAllPaymentMethod($id);

        $card = Card::addPaymentMethodDB($paymentMethod, $id, $request->name);
        if ($card) {
            if ($existingCard->isEmpty()) {
                $ret = Card::makeDefaultMethodForUser($stripe_id, $card->stripe_payment_method);
                if (!$ret) {
                    return response()->json(['error' => 'Some error occured with stripe payment.'], 400);
                }
                if ($ret['error']) {
                    return response()->json(['error' => $ret['error']], 400);
                }
            }
            return response()->json(
                [
                    'success' => true,
                    'message' => 'Payment method added',
                    'card_id' => $card->id
                ]
            );
        }
        //return error
    }


    /**
     * @OA\Post(
     *     path="/api/card/make-default-payment-method/{id}",
     *     tags={"card"},
     * @OA\Parameter(
     *     name="id",
     *     in="path",
     *     description="User ID of Customer",
     *     required=true,
     * ),
     * @OA\Parameter(
     *     name="cardID",
     *     in="query",
     *     description="Card ID from the DB",
     * ),
     *     @OA\Response(response="200", description="Make an existing payment method default"),
     * security={
     *         {"query_token": {}}
     *     }
     * )
     */
    public function makeDefault(request $request, $id)
    {
        $this->validate(
            $request->all(),
            [
                'cardID' => ['required'],
            ]
        );
        $user = Auth::user();
        $id = $user->id;
        if (!User::find($id)) {
            return response()->json(['error' => 'User does not exist.'], 400);
        }
        $stripe_id = User::getUserStripeId($id);
        if (!$stripe_id) {
            return response()->json(['error' => 'users stripe does not exists.'], 400);
        }

        $paymentMethod = Card::getPaymentMethod($request->cardID);
        if (!$paymentMethod) {
            return response()->json(['error' => 'Payment Method does not exists.'], 400);
        }
        $ret = Card::makeDefaultMethodForUser($stripe_id, $paymentMethod->stripe_payment_method);
        if (!$ret) {
            return response()->json(['error' => 'Some error occured with stripe payment.'], 400);
        }
        if ($ret['error']) {
            return response()->json(['error' => $ret['error']], 400);
        }

        return response()->json(
            [
                'success' => true,
                'message' => 'Payment method updated'
            ]
        );
    }

    /**
     * @OA\Get(
     *     path="/api/card/view-cards/{id}",
     *     tags={"card"},
     * @OA\Parameter(
     *     name="id",
     *     in="path",
     *     description="User ID of Customer",
     * ),
     *     @OA\Response(response="200", description="View Users added cards"),
     * security={
     *         {"query_token": {}}
     *     }
     * )
     */

    public function view($id)
    {
        $user = Auth::user();
        $id = $user->id;
        if (!User::find($id)) {
            return response()->json(['error' => 'User does not exist.'], 400);
        }
        $cards = Card::getAllPaymentMethod($id);
        if ($cards) {
            $default = $this->viewDefault($id);
            if ($default) {
                foreach ($cards as $key => $card) {
                    if ($card->id == $default->id) {
                        $cards[$key]['default'] = 1;
                    }
                }
            }
            return response()->json($cards);
        }

        return response()->json(['error' => 'No cards added.'], 400);
    }

    /**
     * @OA\Get(
     *     path="/api/card/view-default/{id}",
     *     tags={"card"},
     * @OA\Parameter(
     *     name="id",
     *     in="path",
     *     description="User ID of Customer",
     * ),
     *     @OA\Response(response="200", description="View Users default"),
     * security={
     *         {"query_token": {}}
     *     }
     * )
     */

    public function viewDefault($id)
    {
        $user = Auth::user();
        $id = $user->id;
        if (!User::find($id)) {
            return response()->json(['error' => 'User does not exist.'], 400);
        }
        $stripe_id = User::getUserStripeId($id);
        if (!$stripe_id) {
            return response()->json(['error' => 'users stripe does not exists.'], 400);
        }
        $defaultPaymentMethod = Card::getDefaultFromStripe($stripe_id);
        if (!$defaultPaymentMethod) {
            return response()->json(['error' => 'No default payment method exists.'], 400);
        }
        if ($defaultPaymentMethod['error']) {
            return response()->json(
                [
                    'message' => $defaultPaymentMethod['error']
                ],
                400
            );
        }
        return $defaultPaymentMethod;
    }


    public function getall()
    {
        return response()->json(Card::with('user')->get());
    }

    /**
     * @OA\Delete(
     *     path="/api/card/delete-card/{cardID}",
     *     tags={"card"},
     * @OA\Parameter(
     *     name="cardID",
     *     in="path",
     *     description="ID of the card added in the DB",
     *     required=true,
     * ),
     *     @OA\Response(response="200", description="Delete and detach payment method/card"),
     * security={
     *         {"query_token": {}}
     *     }
     * )
     */

    public function deleteCard($cardID)
    {
        $paymentMethod = Card::getPaymentMethod($cardID);
        if (!$paymentMethod) {
            return response()->json(['error' => 'Payment Method does not exists.'], 400);
        }
        $ret = Card::detachPaymentMethod($paymentMethod->stripe_payment_method);
        if ($ret) {
            return response()->json(['error' => $ret], 400);
        }
        Card::deletePaymentMethodRecord($cardID);
        return response()->json(
            [
                'success' => true,
                'message' => 'Payment method Deleted'
            ]
        );
    }


    public function getDeletedCards()
    {
        return response()->json(Card::onlyTrashed()->with('user')->get());
    }

}
