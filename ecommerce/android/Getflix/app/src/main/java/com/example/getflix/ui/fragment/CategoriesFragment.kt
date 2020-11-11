package com.example.getflix.ui.fragment

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.example.getflix.R
import com.example.getflix.adapters.SubcategoryAdapter
import com.example.getflix.databinding.FragmentCategoriesBinding


class CategoriesFragment : Fragment() {
    private lateinit var categoriesViewModel: CategoriesViewModel


    override fun onCreateView(
            inflater: LayoutInflater, container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        val binding = DataBindingUtil.inflate<FragmentCategoriesBinding>(inflater, R.layout.fragment_categories,
                container, false)
        categoriesViewModel = ViewModelProvider(this).get(CategoriesViewModel::class.java)
        val adapter = SubcategoryAdapter()
        categoriesViewModel.displayedCategories.observe(viewLifecycleOwner, Observer {
            it.let {
                adapter.submitList(it["woman"])
            }
        })
        return binding.root
    }
}
