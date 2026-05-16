<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\ActivityLogger;

class PaymentController extends Controller
{
    /**
     * Display a listing of payments, filtered by date or student.
     */
    public function index(Request $request)
    {
        $query = Payment::with(['student.user']);

        if ($request->has('from_date') && $request->has('to_date')) {
            $query->whereBetween('payment_date', [$request->from_date, $request->to_date]);
        } elseif ($request->has('date')) {
            $query->whereDate('payment_date', $request->date);
        }

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        $payments = $query->get();
        return response()->json(['status' => 'success', 'data' => $payments]);
    }

    /**
     * Store a newly created payment record.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'status' => 'required|in:pending,completed,failed',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $payment = Payment::create($request->all());

        ActivityLogger::log('create', 'payments', 'Recorded a payment of ' . $payment->amount . ' for student ID ' . $payment->student_id);

        return response()->json([
            'status' => 'success', 
            'data' => $payment, 
            'message' => 'Payment recorded successfully.'
        ], 201);
    }

    /**
     * Display the specified payment.
     */
    public function show($id)
    {
        $payment = Payment::with('student.user')->find($id);
        if (!$payment) {
            return response()->json(['status' => 'error', 'message' => 'Payment record not found.'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $payment]);
    }

    /**
     * Update payment status.
     */
    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);
        if (!$payment) {
            return response()->json(['status' => 'error', 'message' => 'Payment record not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|in:pending,completed,failed',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        $payment->update($request->all());

        ActivityLogger::log('update', 'payments', 'Updated payment status to ' . $payment->status . ' for payment ID ' . $payment->id);

        return response()->json(['status' => 'success', 'data' => $payment, 'message' => 'Payment status updated.']);
    }

    /**
     * Process a payment (simulate transaction).
     */
    public function process($id)
    {
        $payment = Payment::find($id);
        
        if (!$payment) {
            return response()->json(['status' => 'error', 'message' => 'Payment record not found.'], 404);
        }

        if ($payment->status === 'completed') {
            return response()->json(['status' => 'error', 'message' => 'Payment already completed.'], 400);
        }

        // Simulate processing...
        $payment->status = 'completed';
        $payment->payment_method = request('payment_method', 'Credit Card');
        $payment->payment_date = now();
        $payment->save();

        ActivityLogger::log('process', 'payments', 'Processed payment ID ' . $payment->id);

        return response()->json(['status' => 'success', 'data' => $payment, 'message' => 'Payment processed successfully.']);
    }
}