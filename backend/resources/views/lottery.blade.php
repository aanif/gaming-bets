



@extends('layout.mainlayout')

@section('content')

    <!-- Breadcrumb Area Start -->
    <section class="breadcrumb-area bc-lottery">
        <img class="bc-img" src="assets/images/breadcrumb/lottery.png" alt="">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <h4 class="title">
                        Lottery
                    </h4>
                    <ul class="breadcrumb-list">
                        <li>
                            <a href="/index">
                                <i class="fas fa-home"></i>
                                Home
                            </a>
                        </li>
                        <li>
                            <span><i class="fas fa-chevron-right"></i> </span>
                        </li>
                        <li>
                            <a href="/lottery">Lottery</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
    <!-- Breadcrumb Area End -->

    <!-- Lottery Staticstics Area Start -->
    <section class="lottery-area">
        <div class="lottery-staticstics">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4">
                        <div class="single-staticstics">
                            <div class="left">
                                <div class="icon">
                                    <img src="assets/images/lottery/st1.png" alt="">
                                </div>
                            </div>
                            <div class="right">
                                <h4 class="title">Lottery Jackpot</h4>
                                <div class="count">
                                    <img src="assets/images/icon1.png" alt="">
                                    <span>0.416250</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="single-staticstics">
                            <div class="left">
                                <div class="icon">
                                    <img src="assets/images/lottery/st2.png" alt="">
                                </div>
                            </div>
                            <div class="right">
                                <h4 class="title">Purchased Tickets</h4>
                                <div class="count">
                                    <img src="assets/images/tikit-icon.png" alt="">
                                    <span>120</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="single-staticstics">
                            <div class="left">
                                <div class="icon">
                                    <img src="assets/images/lottery/st2.png" alt="">
                                </div>
                            </div>
                            <div class="right">
                                <h4 class="title">My Tickets</h4>
                                <div class="count">
                                    <img src="assets/images/tikit-icon.png" alt="">
                                    <span>02</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="daily-lottery">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8 col-md-10">
                        <div class="section-heading">
                            <h5 class="subtitle">
                                Try to check out our
                            </h5>
                            <h2 class="title">
                                Daily Lottery
                            </h2>
                            <p class="text">
                                We update our site regularly; more and more winners are added every day! To locate the most recent winner's information
                            </p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="draw-time">
                            <h5 class="subtitle">
                                Lottery Draw Starts In:
                            </h5>
                            <div class="draw-counter">
                                <div data-countdown="2021/12/15"></div>
                            </div>
                            <p class="text">
                                To meet Today's challenges
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="buy-tickets">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="buy-tickets-box">
                            <div class="heading">
                                <h4 class="title">
                                    Buy Lottery Tickets
                                </h4>
                                <div class="right-area">
                                    <select>
                                        <option value="1">BTC</option>
                                        <option value="1">BTC</option>
                                        <option value="1">BTC</option>
                                    </select>
                                </div>
                            </div>
                            <div class="content">
                                <div class="top-area">
                                    <div class="row">
                                        <div class="col-lg-3">
                                            <div class="info-box">
                                                <h4 class="title">
                                                    BALANCE
                                                </h4>
                                                <div class="number">
                                                    <i class="fab fa-bitcoin"></i>
                                                    0.0000
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-3">
                                            <div class="info-box">
                                                <h4 class="title">
                                                    1 TICKET COSTS
                                                </h4>
                                                <div class="number">
                                                    <i class="fab fa-bitcoin"></i>
                                                    0.0000
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-3">
                                            <div class="info-box">
                                                <h4 class="title">
                                                    QUANTITY
                                                </h4>
                                                <div class="number">
                                                    <input type="number" value="1">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-3">
                                            <div class="info-box">
                                                <h4 class="title">
                                                    TOTAL COST
                                                </h4>
                                                <div class="number">
                                                    <i class="fab fa-bitcoin"></i>
                                                    0.0000
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="game-numbers">
                                    <h4 class="title">
                                        GAME NUMBERS
                                    </h4>
                                    <div class="number-box">
                                        <div class="auto-number">
                                            <div class="top-content">
                                                <input type="radio" id="auto-num" name="auto-num">
                                                <label for="auto-num">
                                                    Auto Generated
                                                    <span>
																Random numbers will be generated automatically
														</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div class="manual-number">
                                            <div class="top-content">
                                                <input type="radio" id="manual-num" name="auto-num">
                                                <label for="manual-num">
                                                    Manual Select
                                                    <span>Pick 5 numbers manually</span>
                                                </label>
                                            </div>
                                            <div class="main-content">
                                                <ul class="number-list">
                                                    <li>1</li>
                                                    <li>2</li>
                                                    <li>3</li>
                                                    <li>4</li>
                                                    <li>5</li>
                                                    <li>6</li>
                                                    <li>7</li>
                                                    <li>8</li>
                                                    <li class="active">9</li>
                                                    <li>10</li>
                                                    <li>11</li>
                                                    <li>12</li>
                                                    <li class="active">13</li>
                                                    <li>14</li>
                                                    <li>15</li>
                                                    <li>16</li>
                                                    <li>17</li>
                                                    <li>18</li>
                                                    <li>19</li>
                                                    <li class="active">20</li>
                                                    <li>21</li>
                                                    <li class="active">22</li>
                                                    <li>23</li>
                                                    <li>24</li>
                                                    <li>25</li>
                                                    <li>26</li>
                                                    <li>27</li>
                                                    <li>28</li>
                                                    <li class="active">29</li>
                                                    <li>30</li>
                                                    <li>31</li>
                                                    <li>32</li>
                                                    <li>33</li>
                                                    <li>34</li>
                                                    <li>35</li>
                                                    <li>36</li>
                                                    <li>37</li>
                                                    <li>38</li>
                                                    <li>39</li>
                                                    <li>40</li>
                                                    <li>41</li>
                                                    <li>42</li>
                                                    <li>43</li>
                                                    <li>44</li>
                                                    <li>45</li>
                                                    <li>46</li>
                                                    <li>47</li>
                                                    <li>48</li>
                                                    <li>49</li>
                                                    <li>50</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 text-center">
                                        <a href="#" class="mybtn1">Buy ticket</a>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Lottery Staticstics  Area End -->

    <!-- Latest Activities Area Start -->
    <section class="activities">
        <img class="shape shape1" src="assets/images/people/shape1.png" alt="">
        <img class="shape shape2" src="assets/images/people/shape2.png" alt="">
        <img class="shape shape3" src="assets/images/people/shape3.png" alt="">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 col-md-10">
                    <div class="section-heading">
                        <h5 class="subtitle">
                            Daily Lottery
                        </h5>
                        <h2 class="title">
                            Latest Activites
                        </h2>
                        <p class="text">
                            The world’s first truly fair and global lottery. Each player has
                            the highest chances to win the JACKPOT
                        </p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="tab-menu-area">
                        <ul class="nav nav-lend mb-3" id="pills-tab" role="tablist">
                            <li class="nav-item">
                                <a class="nav-link active" id="pills-all-bets-tab" data-toggle="pill" href="#pills-all-bets" role="tab" aria-controls="pills-all-bets" aria-selected="true">Purchased Tickets</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="pills-my-bets-tab" data-toggle="pill" href="#pills-my-bets" role="tab" aria-controls="pills-my-bets" aria-selected="false">My tickets</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" id="pills-history-tab" data-toggle="pill" href="#pills-history" role="tab" aria-controls="pills-history" aria-selected="false">History</a>
                            </li>
                        </ul>
                    </div>
                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="pills-all-bets" role="tabpanel" aria-labelledby="pills-all-bets-tab">
                            <div class="responsive-table">
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">USER</th>
                                        <th scope="col">Ticket numbers</th>
                                        <th scope="col">Tickets</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p1.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p2.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p3.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p4.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p5.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p1.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p2.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p3.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p4.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p5.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="pills-my-bets" role="tabpanel" aria-labelledby="pills-my-bets-tab">
                            <div class="responsive-table">
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">USER</th>
                                        <th scope="col">Ticket numbers</th>
                                        <th scope="col">Tickets</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p1.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p2.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p3.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p4.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p5.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p1.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p2.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p3.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p4.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p5.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="tab-pane fade" id="pills-history" role="tabpanel" aria-labelledby="pills-history-tab">
                            <div class="responsive-table">
                                <table class="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">USER</th>
                                        <th scope="col">Ticket numbers</th>
                                        <th scope="col">Tickets</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p1.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p2.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p3.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p4.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p5.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p1.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p2.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p3.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p4.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="assets/images/people/p5.png" alt="">
                                            Tom Bass
                                        </td>
                                        <td>
                                            <ul class="number-list">
                                                <li>24</li>
                                                <li>25</li>
                                                <li>26</li>
                                                <li>27</li>
                                                <li>28</li>
                                            </ul>
                                        </td>
                                        <td>
                                            01
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- How it Work Area Start -->
        <div class="how-it-work">
            <img class="bg-shape" src="assets/images/howitwork/bg-shape.png" alt="">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8 col-md-10">
                        <div class="section-heading">
                            <h5 class="subtitle">
                                Want to see how
                            </h5>
                            <h2 class="title">
                                How it works?
                            </h2>
                            <p class="text">
                                We update our site regularly; more and more winners are added every day! To locate the most recent winner's information
                            </p>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4">
                        <div class="single-work">
                            <img src="assets/images/howitwork/ic1.png" alt="">
                            <h4 class="title">
                                Choose
                            </h4>
                            <p>
                                Lorem ipsum dolor, sit amet
                                consectetur adipisicing elit. Aliqui eum atque.
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="single-work">
                            <img src="assets/images/howitwork/ic2.png" alt="">
                            <h4 class="title">
                                BUY
                            </h4>
                            <p>
                                Lorem ipsum dolor, sit amet
                                consectetur adipisicing elit. Aliqui eum atque.
                            </p>
                        </div>
                    </div>
                    <div class="col-lg-4">
                        <div class="single-work">
                            <img src="assets/images/howitwork/ic3.png" alt="">
                            <h4 class="title">
                                WIN
                            </h4>
                            <p>
                                Lorem ipsum dolor, sit amet
                                consectetur adipisicing elit. Aliqui eum atque.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- How it Work Area Start -->
    </section>
    <!-- Latest Activities Area End -->

    <!-- lottery video Area Start -->
    <section class="lottery-video">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-10">
                    <div class="video-box">
                        <a href="#" class="video-play-btn video-icon mfp-iframe">
                            <img src="assets/images/play-icon-red.png" alt="">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- lottery video Area End -->

    <!-- Questions Area Start -->
    <section class="question-area">
        <div class="container">
            <div class="row">
                <div class="col-lg-6">
                    <img src="assets/images/question-left.png" alt="">
                </div>
                <div class="col-lg-6">
                    <div class="section-heading">
                        <h5 class="subtitle">
                            If you have any
                        </h5>
                        <h2 class="title">
                            questions
                        </h2>
                        <p class="text">
                            Our top priorities are to protect your privacy,
                            provide secure transactions, and safeguard your data.
                        </p>
                        <p class="text">
                            When you're ready to play, registering an
                            account is required so we know you're of legal age and so no one else can use your account.We answer the most commonly asked lotto
                            questions..
                        </p>
                        <a href="#" class="mybtn1">Check FAQs</a>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Questions Area End -->

    <!-- Recent Winners Area Start -->
    <section class="recent-winners">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 col-md-10">
                    <div class="section-heading">
                        <h5 class="subtitle">
                            Try to Check out our
                        </h5>
                        <h2 class="title">
                            Recent Winners
                        </h2>
                        <p class="text">
                            We update our site regularly; more and more winners are added every day! To locate the most recent winner's information
                        </p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4">
                    <div class="single-winer">
                        <div class="top-area">
                            <div class="left">
                                <h4 class="name">
                                    Leroy Roy
                                </h4>
                                <p class="date">
                                    01.08.2019
                                </p>
                            </div>
                            <div class="right">
                                <p class="id">#5747e75482</p>
                            </div>
                        </div>
                        <div class="bottom-area">
                            <div class="left">
                                0.099 ETH
                            </div>
                            <div class="right">
                                <img src="assets/images/icon2.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="single-winer">
                        <div class="top-area">
                            <div class="left">
                                <h4 class="name">
                                    Jeff Mack
                                </h4>
                                <p class="date">
                                    01.08.2019
                                </p>
                            </div>
                            <div class="right">
                                <p class="id">#5747e75482</p>
                            </div>
                        </div>
                        <div class="bottom-area">
                            <div class="left">
                                0.099 ETH
                            </div>
                            <div class="right">
                                <img src="assets/images/icon2.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="single-winer">
                        <div class="top-area">
                            <div class="left">
                                <h4 class="name">
                                    Neal Morris
                                </h4>
                                <p class="date">
                                    01.08.2019
                                </p>
                            </div>
                            <div class="right">
                                <p class="id">#5747e75482</p>
                            </div>
                        </div>
                        <div class="bottom-area">
                            <div class="left">
                                0.099 ETH
                            </div>
                            <div class="right">
                                <img src="assets/images/icon2.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12 text-xl-center">
                    <a class="mybtn2" href="#">View All </a>
                </div>
            </div>
        </div>
    </section>
    <!-- Recent Winners Area End -->

@endsection







